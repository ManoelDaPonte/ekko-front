import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Configuration pour utiliser ffmpeg static
ffmpeg.setFfmpegPath(ffmpegStatic);

// Configure formidable pour désactiver le body parser par défaut
export const config = {
	api: {
		bodyParser: false,
	},
};

// Formats de fichiers autorisés
const ALLOWED_AUDIO_EXTENSIONS = [
	"mp3",
	"wav",
	"aac",
	"mp4",
	"wave",
	"mpeg",
	"flac",
	"ogg",
	"wma",
	"aiff",
	"alac",
];
const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "avi", "mov", "flv", "mkv", "webm"];

// Formats acceptés par OpenAI
const OPENAI_ACCEPTED_FORMATS = [
	"flac",
	"m4a",
	"mp3",
	"mp4",
	"mpeg",
	"mpga",
	"oga",
	"ogg",
	"wav",
	"webm",
];

// Taille maximale de fichier pour OpenAI (25 MB)
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	// Vérifier la clé API OpenAI
	if (!process.env.OPENAI_API_KEY) {
		console.error("OPENAI_API_KEY is not set");
		return res
			.status(500)
			.json({ message: "Server configuration error: API key not set" });
	}

	// Initialiser OpenAI
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	// Créer un répertoire temporaire pour nos fichiers
	const tempDir = path.join(os.tmpdir(), uuidv4());
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir, { recursive: true });
	}

	try {
		// Configurer formidable
		const options = {
			maxFileSize: 100 * 1024 * 1024, // 100 MB max pour le téléchargement initial
		};

		// Parser le formulaire
		const [fields, files] = await new Promise((resolve, reject) => {
			const form = new IncomingForm(options);
			form.parse(req, (err, fields, files) => {
				if (err) return reject(err);
				resolve([fields, files]);
			});
		});

		// Récupérer le fichier
		const fileField = files.file;
		const file = Array.isArray(fileField) ? fileField[0] : fileField;

		if (!file) {
			return res.status(400).json({ message: "No file found" });
		}

		// Récupérer la langue
		const languageField = fields.language;
		const language = Array.isArray(languageField)
			? languageField[0]
			: languageField || "";

		// Récupérer l'extension de fichier
		const filename = file.originalFilename || "";
		const fileExtension = filename.split(".").pop().toLowerCase();

		console.log(
			`Processing file: ${filename}, Extension: ${fileExtension}, Language: ${
				language || "default"
			}`
		);

		// Vérifier si le format est supporté
		const isAudio = ALLOWED_AUDIO_EXTENSIONS.includes(fileExtension);
		const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(fileExtension);

		if (!isAudio && !isVideo) {
			return res.status(400).json({
				message: `Unsupported file format: ${fileExtension}. Supported formats: ${[
					...ALLOWED_AUDIO_EXTENSIONS,
					...ALLOWED_VIDEO_EXTENSIONS,
				].join(", ")}`,
			});
		}

		// Chemin du fichier source
		const filePath = file.filepath;

		// Pour les fichiers audio et vidéo, nous allons toujours créer un fichier MP3 temporaire
		// C'est un format qui fonctionne bien avec l'API OpenAI
		let tempAudioPath;

		if (isAudio) {
			// Si c'est un audio, nous le convertissons en MP3 pour assurer la compatibilité
			tempAudioPath = path.join(tempDir, "audio.mp3");

			console.log("Converting audio to MP3...");
			await new Promise((resolve, reject) => {
				ffmpeg(filePath)
					.output(tempAudioPath)
					.audioCodec("libmp3lame")
					.format("mp3")
					.on("end", resolve)
					.on("error", (err) => {
						console.error("FFmpeg error:", err);
						reject(
							new Error(
								`FFmpeg error during audio conversion: ${err.message}`
							)
						);
					})
					.run();
			});
		} else if (isVideo) {
			// Si c'est une vidéo, nous extrayons l'audio en MP3
			tempAudioPath = path.join(tempDir, "audio.mp3");

			console.log("Extracting audio from video to MP3...");
			await new Promise((resolve, reject) => {
				ffmpeg(filePath)
					.output(tempAudioPath)
					.noVideo()
					.audioCodec("libmp3lame")
					.format("mp3")
					.on("end", resolve)
					.on("error", (err) => {
						console.error("FFmpeg error:", err);
						reject(
							new Error(
								`FFmpeg error during video extraction: ${err.message}`
							)
						);
					})
					.run();
			});
		}

		// Vérifier la taille du fichier audio converti
		const stats = fs.statSync(tempAudioPath);
		console.log(
			`Audio file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`
		);

		if (stats.size > MAX_FILE_SIZE) {
			// Nettoyer
			fs.rmSync(tempDir, { recursive: true, force: true });
			return res.status(400).json({
				message: `Audio file size (${(
					stats.size /
					(1024 * 1024)
				).toFixed(2)} MB) exceeds limit of 25 MB for OpenAI API`,
			});
		}

		try {
			console.log(`Transcribing audio from ${tempAudioPath}...`);

			// Transcrire l'audio avec un nom de fichier simple et connu
			const transcription = await openai.audio.transcriptions.create({
				file: fs.createReadStream(tempAudioPath),
				model: "whisper-1",
				language: language || undefined,
			});

			// Nettoyer les fichiers temporaires
			fs.rmSync(tempDir, { recursive: true, force: true });

			console.log("Transcription completed successfully!");
			return res.status(200).json({
				result: transcription.text,
			});
		} catch (openaiError) {
			console.error("OpenAI API error:", openaiError);

			// Nettoyer les fichiers temporaires
			fs.rmSync(tempDir, { recursive: true, force: true });

			return res.status(500).json({
				message: "Error transcribing audio",
				error: openaiError.message,
				details: openaiError.response
					? JSON.stringify(openaiError.response)
					: "No detailed error information",
			});
		}
	} catch (error) {
		console.error("Error processing transcription:", error);

		// Nettoyer les fichiers temporaires si le répertoire existe
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}

		// Messages d'erreur plus spécifiques
		if (error.name === "PayloadTooLargeError") {
			return res.status(413).json({
				message: "File too large",
				error: error.message,
			});
		}

		if (error.code === "ENOENT") {
			return res.status(500).json({
				message: "File processing error",
				error: "File not found or could not be accessed",
			});
		}

		// Pour les erreurs OpenAI
		if (error.response && error.response.data) {
			return res.status(500).json({
				message: "OpenAI API error",
				error: error.response.data.error.message || error.message,
			});
		}

		return res.status(500).json({
			message: "Error processing transcription",
			error: error.message,
		});
	}
}
