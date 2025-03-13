import React, { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/DropBox.module.css";

const AudioFileHandler = ({
	selectedAudio,
	setSelectedAudio,
	isTranscribing,
	currentStatus,
}) => {
	const audio_mime_types = [
		"audio/mpeg",
		"audio/wav",
		"audio/aac",
		"audio/flac",
		"audio/ogg",
		"audio/x-ms-wma",
		"audio/x-aiff",
		"audio/alac",
		"audio/mp4",
		"audio/wave",
		"video/mpeg",
		"video/x-matroska",
		"video/quicktime",
		"video/mp4",
	];
	const fileInputRef = useRef(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file && isAudioFile(file)) {
			setSelectedAudio(file);
		}
		event.target.value = null; // Resetting the input value
	};

	const isAudioFile = (file) => {
		// Vérification plus robuste des types de fichiers
		if (audio_mime_types.includes(file.type)) {
			return true;
		}
		// Vérification de l'extension pour les cas où le type MIME n'est pas correctement identifié
		const extension = file.name.split(".").pop().toLowerCase();
		const audioExtensions = [
			"mp3",
			"wav",
			"aac",
			"flac",
			"ogg",
			"wma",
			"aiff",
			"mp4",
			"mpeg",
			"mkv",
			"mov",
		];
		return audioExtensions.includes(extension);
	};

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragOver(false);

		// Vérifier s'il y a des fichiers
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			if (isAudioFile(file)) {
				setSelectedAudio(file);
			} else {
				alert(
					"Format de fichier non supporté. Veuillez sélectionner un fichier audio ou vidéo."
				);
			}
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragOver(false);
	};

	const handleDropBoxClick = () => {
		// Empêche de cliquer sur le dropbox pendant la transcription
		if (!isTranscribing) {
			fileInputRef.current.click();
		}
	};

	return (
		<div style={{ position: "relative", zIndex: 2 }}>
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onClick={handleDropBoxClick}
				className={`${styles.DropBox} ${
					isTranscribing ? styles.disabled : ""
				}`}
				style={{
					cursor: isTranscribing ? "default" : "pointer",
					...(isDragOver && !isTranscribing
						? {
								borderColor: "#ffffff",
								backgroundColor: "rgba(0, 0, 0, 0.4)",
						  }
						: {}),
				}}
			>
				{isTranscribing ? (
					<div className={styles.processingContainer}>
						<LoadingSpinner />
						<div className={styles.processingMessage}>
							{currentStatus || "Processing..."}
						</div>
					</div>
				) : (
					<div>
						<div className={styles.iconContainer}>
							<FaMicrophone className={styles.icon} />
						</div>
						<div className={styles.promptContainerDrop}>
							Drop an audio file here
						</div>
						<div className={styles.separator}></div>
						<div className={styles.promptContainer}>
							or click to select
						</div>
					</div>
				)}
			</div>
			<input
				type="file"
				accept={audio_mime_types.join(", ")}
				onChange={handleFileChange}
				ref={fileInputRef}
				style={{ display: "none" }}
				disabled={isTranscribing}
			/>
		</div>
	);
};

export default AudioFileHandler;
