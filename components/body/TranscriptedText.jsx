import React from "react";
import styles from "../../styles/body/TranscriptedText.module.css";
import { LoremIpsum } from "react-lorem-ipsum";

const TranscriptionDisplay = ({ transcription }) => {
  const copyToClipboard = () => {
    // Logic to copy the transcription text to the clipboard
    // You can use document.execCommand('copy') or other methods here
  };

  return (
    <div className={styles.scrollableBox}>
      <div className={styles.header}>
        <h2>Title of the Box</h2>
        <button onClick={copyToClipboard}>Copy Text</button>
      </div>
      <div className={styles.transcription}>
        {transcription}
        <LoremIpsum p={3} />
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
