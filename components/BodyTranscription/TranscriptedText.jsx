import React, { useState } from "react";
import styles from "../../styles/TranscriptedText.module.css";
import { FaCopy, FaFileCode, FaFileAlt, FaClock } from "react-icons/fa";

const TranscriptionDisplay = ({ transcription, selectedAudio }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        // Copy the transcription to clipboard
        await navigator.clipboard.writeText(transcription);

        // Indicate the text was copied
        setIsCopied(true);

        // After a duration, revert the copied indication
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{selectedAudio ? selectedAudio.name : ""}</h2>
                <div className={styles.iconsWrapper}>
                    <FaFileCode className={styles.icon} title="JSON" />
                    <FaFileAlt className={styles.icon} title="TXT" />
                    <FaClock className={styles.icon} title="Timecode" />
                    <FaCopy
                        onClick={copyToClipboard}
                        className={`${styles.icon} ${
                            isCopied ? styles.copied : ""
                        }`}
                    />
                </div>
            </div>
            <div className={styles.contentWrapper}></div>
            <div className={styles.contentWrapper2}></div>
            <div className={styles.scrollableBox}>
                <div className={styles.text}>{transcription}</div>
            </div>
        </div>
    );
};

export default TranscriptionDisplay;
