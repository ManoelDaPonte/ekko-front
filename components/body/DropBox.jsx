import React, { useRef } from "react";
import styles from "../../styles/body/DropBox.module.css";

const AudioFileHandler = ({ selectedAudio, setSelectedAudio }) => {
  const audio_mime_types = [
    "audio/mpeg",
    "audio/wav",
    "audio/aac",
    "audio/flac",
    "audio/ogg",
    "audio/x-ms-wma",
    "audio/x-aiff",
    "audio/alac",
    "audio/mp4",
    "audio/wave",
    "video/mpeg",
    "video/x-matroska",
    "video/quicktime",
    "video/video/mp4",
  ];
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && audio_mime_types.includes(file.type)) {
      setSelectedAudio(file);
    }
    event.target.value = null; // Resetting the input value
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && audio_mime_types.includes(file.type)) {
      setSelectedAudio(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearSelectedAudio = () => {
    setSelectedAudio(null);
  };
  const handleDropBoxClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleDropBoxClick}
        className={styles.DropBox}
      >
        {selectedAudio ? (
          <div></div>
        ) : (
          <div>
            <div className={styles.promptContainerDrop}>
              Drop an audio file here
            </div>
            <div className={styles.separator}></div>
            <div className={styles.promptContainer}>or click to select</div>
          </div>
        )}
      </div>
      <input
        type="file"
        accept={audio_mime_types.join(", ")}
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioFileHandler;
