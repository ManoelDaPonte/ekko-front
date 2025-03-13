// pages/api/transcribe.jsx - Correction de l'extraction d'extension
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

// Fonction robuste pour extraire l'extension
function getFileExtension(filename) {
	return filename
		.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
		.toLowerCase();
}

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
			maxFileSize: 10 * 1024 * 1024, // 10 MB max
			keepExtensions: true,
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

		// Récupérer l'extension de fichier CORRECTEMENT
		const filename = file.originalFilename || "";
		const fileExtension = getFileExtension(filename);

		console.log(
			`Processing file: ${filename}, Extension: ${fileExtension}, Language: ${
				language || "default"
			}, Size: ${file.size / 1024} KB`
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

		try {
			console.log(`Transcribing audio from ${tempAudioPath}...`);

			// Transcrire l'audio
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
			});
		}
	} catch (error) {
		console.error("Error processing transcription:", error);

		// Nettoyer les fichiers temporaires si le répertoire existe
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}

		return res.status(500).json({
			message: "Error processing transcription",
			error: error.message,
		});
	}
}
