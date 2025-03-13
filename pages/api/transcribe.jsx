import formidable from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
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

// Taille maximale de fichier pour OpenAI (25 MB)
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	// Initialiser OpenAI
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		// Configurer formidable
		const form = new formidable.IncomingForm();

		// Parser le formulaire
		const { fields, files } = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err);
				resolve({ fields, files });
			});
		});

		// Récupérer le fichier
		const file = files.file;
		if (!file) {
			return res.status(400).json({ message: "No file found" });
		}

		// Récupérer la langue
		const language = fields.language?.[0] || "";

		// Récupérer l'extension de fichier
		const fileExtension = file.originalFilename
			.split(".")
			.pop()
			.toLowerCase();

		// Vérifier si le format est supporté
		const isAudio = ALLOWED_AUDIO_EXTENSIONS.includes(fileExtension);
		const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(fileExtension);

		if (!isAudio && !isVideo) {
			return res.status(400).json({ message: "Unsupported file format" });
		}

		// Chemin du fichier source
		const filePath = file.filepath;

		// Pour les fichiers audio, utiliser directement le fichier
		if (isAudio) {
			// Vérifier la taille du fichier
			const stats = fs.statSync(filePath);
			if (stats.size > MAX_FILE_SIZE) {
				return res.status(400).json({
					message: "File size exceeds limit of 25 MB for OpenAI API",
				});
			}

			// Créer un stream de fichier pour l'envoyer à OpenAI
			const fileStream = fs.createReadStream(filePath);

			setCurrentStatus(res, "Transcribing audio...");

			// Transcrire l'audio
			const transcription = await openai.audio.transcriptions.create({
				file: fileStream,
				model: "whisper-1",
				language: language || undefined,
			});

			return res.status(200).json({
				result: transcription.text,
			});
		}

		// Pour les fichiers vidéo, extraire d'abord l'audio
		if (isVideo) {
			// Créer un fichier temporaire pour l'audio extrait
			const tempDir = os.tmpdir();
			const audioFilename = `${uuidv4()}.wav`;
			const audioPath = path.join(tempDir, audioFilename);

			setCurrentStatus(res, "Extracting audio from video...");

			// Extraire l'audio de la vidéo
			await new Promise((resolve, reject) => {
				ffmpeg(filePath)
					.output(audioPath)
					.noVideo()
					.audioCodec("pcm_s16le")
					.format("wav")
					.on("end", resolve)
					.on("error", reject)
					.run();
			});

			// Vérifier la taille du fichier audio
			const stats = fs.statSync(audioPath);
			if (stats.size > MAX_FILE_SIZE) {
				// Nettoyer
				fs.unlinkSync(audioPath);
				return res.status(400).json({
					message:
						"Extracted audio exceeds limit of 25 MB for OpenAI API",
				});
			}

			// Créer un stream de fichier pour l'audio extrait
			const audioStream = fs.createReadStream(audioPath);

			setCurrentStatus(res, "Transcribing audio...");

			// Transcrire l'audio
			const transcription = await openai.audio.transcriptions.create({
				file: audioStream,
				model: "whisper-1",
				language: language || undefined,
			});

			// Nettoyer le fichier temporaire
			fs.unlinkSync(audioPath);

			return res.status(200).json({
				result: transcription.text,
			});
		}
	} catch (error) {
		console.error("Error processing transcription:", error);
		return res.status(500).json({
			message: "Error processing transcription",
			error: error.message,
		});
	}
}

// Fonction helper pour envoyer des mises à jour de statut
function setCurrentStatus(res, status) {
	// Cette fonction est un placeholder - dans une implémentation réelle,
	// vous pourriez utiliser Server-Sent Events ou WebSockets pour les mises à jour
	console.log(status);
}
