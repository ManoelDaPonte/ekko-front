import { useState } from "react";
import DropBox from "./BodyTranscription/DropBox";
import LaunchTranscription from "./BodyTranscription/LaunchTranscription";
import TranscriptedText from "./BodyTranscription/TranscriptedText";
import CountrySelector from "./BodyTranscription/CountrySelector";
import styles from "../styles/Body.module.css";

const BodyTranscription = () => {
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [transcription, setTranscription] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");

    const handleCountryChange = (code) => {
        setSelectedCountry({ code }); // Assuming you're only receiving the code as a string.
    };

    return (
        <div className={styles.body}>
            <div className={styles.buttonContainer}>
                <DropBox
                    selectedAudio={selectedAudio}
                    setSelectedAudio={setSelectedAudio}
                />
                <LaunchTranscription
                    selectedAudio={selectedAudio}
                    setTranscription={setTranscription}
                    selectedCountry={selectedCountry?.code}
                />
            </div>

            <CountrySelector onCountryChange={handleCountryChange} />
            <TranscriptedText
                transcription={transcription}
                selectedAudio={selectedAudio}
            />
        </div>
    );
};

export default BodyTranscription;
