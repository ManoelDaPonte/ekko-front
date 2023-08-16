import { useState, useEffect } from "react";
import DropBox from "./DropBox";
import ButtonRun from "./Loading";
import TranscriptedText from "./TranscriptedText";
import CountrySelector from "./CountrySelector";
import styles from "../../styles/body/Body.module.css";

const Body = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [transcription, setTranscription] = useState("");

  return (
    <div>
      <div className={styles.buttonContainer}>
        <DropBox
          selectedAudio={selectedAudio}
          setSelectedAudio={setSelectedAudio}
        />

        <ButtonRun
          selectedAudio={selectedAudio}
          setTranscription={setTranscription}
        />
      </div>
      <CountrySelector />
      <TranscriptedText transcription={transcription} />
    </div>
  );
};

export default Body;
