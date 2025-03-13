import React, { useEffect } from "react";
import axios from "axios";

const LaunchTranscription = ({
	selectedAudio,
	setTranscription,
	selectedCountry,
	setIsTranscribing,
	setProcessingStatus,
}) => {
	const handleTransferFile = async (file) => {
		if (!file) return;

		console.log("handleTransferFile called with file:", file?.name);
		try {
			// Mettre à jour l'état de transcription
			setIsTranscribing(true);
			setProcessingStatus("Transcribing...");

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

			setProcessingStatus("Almost done...");

			// Mettre à jour la transcription avec le résultat
			if (response.data && response.data.result) {
				console.log(
					"Transcription received:",
					response.data.result.substring(0, 50) + "..."
				);

				// Utiliser le callback pour mettre à jour la transcription et réinitialiser l'état
				setTranscription(response.data.result);
			} else {
				throw new Error("No transcription result returned");
			}
		} catch (error) {
			console.error("Error during transcription:", error);
			setProcessingStatus("Error occurred");

			// Afficher un message d'erreur plus précis si disponible
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				alert(`Error: ${error.response.data.message}`);
			} else if (error.message.includes("timeout")) {
				alert(
					"The transcription process timed out. Please try with a smaller file."
				);
			} else {
				alert(`Error: ${error.message || "Unknown error occurred"}`);
			}

			// Réinitialiser l'état même en cas d'erreur
			setIsTranscribing(false);
			setProcessingStatus("");
		}
	};

	useEffect(() => {
		// Lancer la transcription lorsqu'un fichier est sélectionné
		if (selectedAudio) {
			handleTransferFile(selectedAudio);
		}
	}, [selectedAudio]);

	// Pas de rendu visible pour ce composant - il gère seulement la logique
	return null;
};

export default LaunchTranscription;
