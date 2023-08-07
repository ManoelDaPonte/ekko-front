import React from "react";
import styles from "../../styles/body/TranscriptedText.module.css";

const TranscriptionDisplay = ({ transcription }) => {
  return <div className={styles.blankText}>{transcription}</div>;
};

export default TranscriptionDisplay;
