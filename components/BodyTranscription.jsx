import { useState } from "react";
import DropBox from "./body/DropBox";
import LaunchTranscription from "./body/LaunchTranscription";
import TranscriptedText from "./body/TranscriptedText";
import CountrySelector from "./body/CountrySelector";
import styles from "../styles/Body.module.css";

const BodyTranscription = () => {
	const [selectedAudio, setSelectedAudio] = useState(null);
	const [transcription, setTranscription] = useState("");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [processingStatus, setProcessingStatus] = useState("");

	const handleCountryChange = (code) => {
		setSelectedCountry(code);
	};

	const handleAudioSelect = (file) => {
		if (!isTranscribing) {
			setSelectedAudio(file);
			// Réinitialiser la transcription lorsqu'un nouveau fichier est sélectionné
			setTranscription("");
		}
	};

	// Cette fonction sera appelée quand la transcription est terminée
	const handleTranscriptionComplete = (text) => {
		setTranscription(text);
		setSelectedAudio(null); // Reset selectedAudio to revert to initial state
		setIsTranscribing(false);
		setProcessingStatus("");
	};

	// Fonction pour mettre à jour le statut du traitement
	const updateProcessingStatus = (status) => {
		setProcessingStatus(status);
	};

	return (
		<div className={styles.body}>
			<div
				className={styles.buttonContainer}
				style={{ position: "relative" }}
			>
				{/* DropBox avec statut de traitement */}
				<DropBox
					selectedAudio={selectedAudio}
					setSelectedAudio={handleAudioSelect}
					isTranscribing={isTranscribing}
					currentStatus={processingStatus}
				/>

				{/* LaunchTranscription est en arrière-plan mais contrôle tout le processus */}
				{selectedAudio && (
					<LaunchTranscription
						selectedAudio={selectedAudio}
						setTranscription={handleTranscriptionComplete}
						selectedCountry={selectedCountry}
						setIsTranscribing={setIsTranscribing}
						setProcessingStatus={updateProcessingStatus}
					/>
				)}
			</div>

			<CountrySelector onCountryChange={handleCountryChange} />
			<TranscriptedText
				transcription={transcription}
				selectedAudio={selectedAudio}
			/>
		</div>
	);
};

export default BodyTranscription;
