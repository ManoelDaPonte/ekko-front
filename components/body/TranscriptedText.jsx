import React from "react";
import styles from "../../styles/body/TranscriptedText.module.css";
import { LoremIpsum } from "react-lorem-ipsum";
import { FaCopy, FaFileCode, FaFileAlt, FaClock } from "react-icons/fa";

const TranscriptionDisplay = ({ transcription }) => {
  const copyToClipboard = () => {
    // Logic to copy the transcription text to the clipboard
    // You can use document.execCommand('copy') or other methods here
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Title of the Box</h2>
        <div className={styles.iconsWrapper}>
          <FaFileCode className={styles.icon} title="JSON" />
          <FaFileAlt className={styles.icon} title="TXT" />
          <FaClock className={styles.icon} title="Timecode" />
          <FaCopy onClick={copyToClipboard} className={styles.icon} />
        </div>
      </div>
      <div className={styles.contentWrapper}></div>
      <div className={styles.contentWrapper2}></div>
      <div className={styles.scrollableBox}>
        <div className={styles.text}>{transcription}</div>
        <LoremIpsum p={5} />
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
