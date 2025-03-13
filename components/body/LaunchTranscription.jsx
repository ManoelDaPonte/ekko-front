// components/body/LaunchTranscription.jsx
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
			setProcessingStatus("Préparation du fichier...");

			// Informer l'utilisateur de la progression sans afficher la taille
			setProcessingStatus(`Transcription de ${file.name}...`);

			const formData = new FormData();
			formData.append("file", file);
			formData.append("language", selectedCountry || "");

			// Appeler l'API de transcription avec un timeout plus long
			const response = await axios.post("/api/transcribe", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				// 3 minutes timeout (plutôt que 10 minutes, car Vercel a une limite de 60s pour les fonctions serverless)
				timeout: 180000,
				// Montre la progression
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setProcessingStatus(
						`Envoi en cours... ${percentCompleted}%`
					);
				},
			});

			setProcessingStatus("Traitement de la transcription...");

			// Mettre à jour la transcription avec le résultat
			if (response.data && response.data.result) {
				console.log(
					"Transcription received:",
					response.data.result.substring(0, 50) + "..."
				);

				setProcessingStatus("Transcription terminée!");

				// On ne modifie plus le texte de la transcription
				let resultText = response.data.result;

				// Utiliser le callback pour mettre à jour la transcription et réinitialiser l'état
				setTranscription(resultText);
			} else {
				throw new Error("Aucun résultat de transcription retourné");
			}
		} catch (error) {
			console.error("Error during transcription:", error);
			setProcessingStatus("Une erreur est survenue");

			// Afficher un message d'erreur plus simple
			let errorMessage =
				"Une erreur s'est produite lors de la transcription.";

			if (error.response && error.response.status === 400) {
				errorMessage = "Format de fichier non supporté.";
			} else if (error.message.includes("timeout")) {
				errorMessage = "Le délai de transcription a expiré.";
			}

			// Afficher l'erreur
			alert(errorMessage);

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
