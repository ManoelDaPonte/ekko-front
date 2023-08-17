import React from "react";
import styles from "../../styles/body/DropBox.module.css";

const AudioFileHandler = ({ selectedAudio, setSelectedAudio }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/wav") {
      setSelectedAudio(file);
    } else {
      alert("Please select a valid .wav audio file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "audio/wav") {
      setSelectedAudio(file);
    } else {
      alert("Please drop a valid .wav audio file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={styles.DropBox}
        >
          {selectedAudio ? (
            <div>
              <h3>Selected Audio:</h3>
              <p>{selectedAudio.name}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <input
          type="file"
          accept=".wav"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </label>
    </div>
  );
};

export default AudioFileHandler;
