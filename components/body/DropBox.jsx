import React, { useRef, useState } from "react";
import { FaMicrophone, FaCheck } from "react-icons/fa";
import styles from "../../styles/DropBox.module.css";

const AudioFileHandler = ({ selectedAudio, setSelectedAudio }) => {
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
		if (file && audio_mime_types.includes(file.type)) {
			setSelectedAudio(file);
		}
		event.target.value = null; // Resetting the input value
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setIsDragOver(false);
		const file = event.dataTransfer.files[0];
		if (file && audio_mime_types.includes(file.type)) {
			setSelectedAudio(file);
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (event) => {
		event.preventDefault();
		setIsDragOver(false);
	};

	const clearSelectedAudio = () => {
		setSelectedAudio(null);
	};

	const handleDropBoxClick = () => {
		fileInputRef.current.click();
	};

	return (
		<div>
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onClick={handleDropBoxClick}
				className={styles.DropBox}
				style={
					isDragOver
						? {
								borderColor: "#ffffff",
								backgroundColor: "rgba(0, 0, 0, 0.4)",
						  }
						: {}
				}
			>
				{selectedAudio ? (
					<div>
						<div className={styles.iconContainer}>
							<FaCheck
								className={styles.icon}
								style={{ color: "#4CAF50" }}
							/>
						</div>
						<div className={styles.promptContainer}>
							{selectedAudio.name}
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
			/>
		</div>
	);
};

export default AudioFileHandler;
