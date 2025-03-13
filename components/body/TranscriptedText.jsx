import React, { useState, useEffect } from "react";
import styles from "../../styles/body/TranscriptedText.module.css";
// Assurez-vous que ces styles existent dans votre CSS
import {
	FaCopy,
	FaFileCode,
	FaFileAlt,
	FaClock,
	FaCheck,
} from "react-icons/fa";

const TranscriptionDisplay = ({ transcription, selectedAudio }) => {
	const [isCopied, setIsCopied] = useState(false);
	const [downloadFormat, setDownloadFormat] = useState(null);

	// Pour réinitialiser l'état isCopied après un délai
	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isCopied]);

	// Pour gérer le téléchargement sous différents formats
	useEffect(() => {
		if (downloadFormat) {
			handleDownload(downloadFormat);
			setDownloadFormat(null);
		}
	}, [downloadFormat, transcription]);

	const copyToClipboard = async () => {
		if (transcription) {
			try {
				// Copier la transcription dans le presse-papier
				await navigator.clipboard.writeText(transcription);

				// Indiquer que le texte a été copié
				setIsCopied(true);
			} catch (error) {
				console.error("Erreur lors de la copie:", error);
				alert("Impossible de copier le texte dans le presse-papier.");
			}
		}
	};

	const handleDownload = (format) => {
		if (!transcription) return;

		let content = "";
		let filename = selectedAudio
			? `${selectedAudio.name.split(".")[0]}-transcription`
			: "transcription";
		let mimeType = "";

		switch (format) {
			case "txt":
				content = transcription;
				filename += ".txt";
				mimeType = "text/plain";
				break;
			case "json":
				content = JSON.stringify({ transcription }, null, 2);
				filename += ".json";
				mimeType = "application/json";
				break;
			default:
				return;
		}

		// Créer un lien de téléchargement
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>{selectedAudio ? selectedAudio.name : "Transcription"}</h2>
				<div className={styles.iconsWrapper}>
					<FaFileCode
						className={styles.icon}
						title="Download JSON"
						onClick={() => setDownloadFormat("json")}
					/>
					<FaFileAlt
						className={styles.icon}
						title="Download TXT"
						onClick={() => setDownloadFormat("txt")}
					/>
					{isCopied ? (
						<FaCheck
							className={`${styles.icon} ${styles.copied}`}
							title="Copied!"
						/>
					) : (
						<FaCopy
							onClick={copyToClipboard}
							className={styles.icon}
							title="Copy to clipboard"
						/>
					)}
				</div>
			</div>
			<div className={styles.contentWrapper}></div>
			<div className={styles.contentWrapper2}></div>
			<div className={styles.scrollableBox}>
				{transcription ? (
					<div className={styles.text}>{transcription}</div>
				) : (
					<div className={styles.placeholder}>
						{selectedAudio
							? "Transcription will appear here once processed..."
							: "Upload an audio or video file to see the transcription here"}
					</div>
				)}
			</div>
		</div>
	);
};

export default TranscriptionDisplay;
