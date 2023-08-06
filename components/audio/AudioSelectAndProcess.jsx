import React, { useState } from "react";
import AudioFileHandler from "./AudioFileHandler";
import AzureFunctionCaller from "./AzureFunctionCaller";
import TranscriptionDisplay from "./TranscriptionDisplay";
import styles from "../../styles/AudioFileSelectAndProcess.module.css";

const AudioSelectAndProcess = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [transcription, setTranscription] = useState("");

  return (
    <div>
      <AudioFileHandler
        selectedAudio={selectedAudio}
        setSelectedAudio={setSelectedAudio}
      />
      <AzureFunctionCaller
        selectedAudio={selectedAudio}
        setTranscription={setTranscription}
      />
      <TranscriptionDisplay transcription={transcription} />
    </div>
  );
};

export default AudioSelectAndProcess;
