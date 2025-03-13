import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/body/LaunchTranscription.module.css";
import axios from "axios";

const LaunchTranscription = ({
	selectedAudio,
	setTranscription,
	selectedCountry,
}) => {
	const [uploading, setUploading] = useState(false);
	const [currentStatus, setCurrentStatus] = useState("");

	const handleTransferFile = async (file) => {
		try {
			setUploading(true);
			setCurrentStatus("Analysing your file...");

			const formData = new FormData();
			formData.append("file", file);
			formData.append("language", selectedCountry || "");

			// Appeler l'API de transcription directement
			const response = await axios.post("/api/transcribe", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				// 10 minutes timeout
				timeout: 600000,
			});

			// Mettre à jour la transcription avec le résultat
			if (response.data && response.data.result) {
				setCurrentStatus("Transcription completed!");
				setTranscription(response.data.result);
			} else {
				throw new Error("No transcription result returned");
			}
		} catch (error) {
			console.error("Error during transcription:", error);
			setCurrentStatus("Error during transcription");

			// Afficher un message d'erreur plus précis si disponible
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				alert(`Error: ${error.response.data.message}`);
			} else {
				alert(`Error: ${error.message || "Unknown error occurred"}`);
			}
		} finally {
			setUploading(false);
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		const droppedFile = event.dataTransfer.files[0];
		if (droppedFile) {
			handleTransferFile(droppedFile);
		} else {
			alert("Please drop a valid audio or video file.");
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		// Lancer la transcription lorsqu'un fichier est sélectionné
		if (selectedAudio) {
			handleTransferFile(selectedAudio);
		}
	}, [selectedAudio]);

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			className={styles.uploadContainer}
		>
			{uploading && <LoadingSpinner />}
			{uploading && <p>{currentStatus}</p>}
		</div>
	);
};

export default LaunchTranscription;
