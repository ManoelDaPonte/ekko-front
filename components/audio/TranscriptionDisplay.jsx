import React from "react";

const TranscriptionDisplay = ({ transcription }) => {
  return (
    transcription && (
      <div>
        <h3>Transcription:</h3>
        <p>{transcription}</p>
      </div>
    )
  );
};

export default TranscriptionDisplay;
