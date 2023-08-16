import React from "react";
import styles from "../../styles/body/TranscriptedText.module.css";
import { LoremIpsum } from "react-lorem-ipsum";

const TranscriptionDisplay = ({ transcription }) => {
  return (
    <div className={styles.scrollableBox}>
      {transcription}
      <LoremIpsum p={0} />
    </div>
  );
};

export default TranscriptionDisplay;
