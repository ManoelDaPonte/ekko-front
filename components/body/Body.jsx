import React, { useState } from "react";
import DropBox from "./DropBox";
import ButtonRun from "./ButtonRun";
import TranscriptedText from "./TranscriptedText";
import styles from "../../styles/body/Body.module.css";

const AudioSelectAndProcess = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [transcription, setTranscription] = useState("");

  return (
    <div>
      <DropBox
        selectedAudio={selectedAudio}
        setSelectedAudio={setSelectedAudio}
      />

      <ButtonRun
        selectedAudio={selectedAudio}
        setTranscription={setTranscription}
      />
      <TranscriptedText transcription={transcription} />
    </div>
  );
};

export default AudioSelectAndProcess;
