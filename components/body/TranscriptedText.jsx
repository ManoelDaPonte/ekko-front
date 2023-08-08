import React from "react";
import styles from "../../styles/body/TranscriptedText.module.css";

const TranscriptionDisplay = ({ transcription }) => {
  if (!transcription) return null;

  return <div className={styles.scrollableBox}>{transcription}</div>;
};

export default TranscriptionDisplay;
