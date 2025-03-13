// pages/api/transcribe.jsx - Version compatible avec Vercel sans FFmpeg
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";

// Configure formidable pour désactiver le body parser par défaut
export const config = {
	api: {
		bodyParser: false,
	},
};

// Formats de fichiers autorisés pour OpenAI
const SUPPORTED_FORMATS = [
	"mp3",
	"mp4",
	"mpeg",
	"mpga",
	"m4a",
	"wav",
	"webm",
	"flac",
	"ogg",
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

		// Récupérer l'extension de fichier
		const filename = file.originalFilename || "";
		const fileExtension = getFileExtension(filename);

		console.log(
			`Processing file: ${filename}, Extension: ${fileExtension}, Language: ${
				language || "default"
			}, Size: ${file.size / 1024} KB`
		);

		// Vérifier si le format est directement supporté par OpenAI
		if (!SUPPORTED_FORMATS.includes(fileExtension)) {
			return res.status(400).json({
				message: `Unsupported file format: ${fileExtension}. OpenAI supports: ${SUPPORTED_FORMATS.join(
					", "
				)}`,
			});
		}

		// Chemin du fichier source
		const filePath = file.filepath;

		try {
			console.log(`Transcribing file directly with OpenAI: ${filePath}`);

			// Transcrire l'audio directement sans conversion FFmpeg
			const transcription = await openai.audio.transcriptions.create({
				file: fs.createReadStream(filePath),
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
