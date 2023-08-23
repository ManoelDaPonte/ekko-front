import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/body/LaunchTranscription.module.css";

const LaunchTranscription = ({ selectedAudio, setTranscription }) => {
  const [uploading, setUploading] = useState(false);

  const handleTransferFile = async (audioFile) => {
    try {
      setUploading(true); // Start the upload
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch(
        "https://first-function-app-mano.azurewebsites.net/api/first-function-app?code=TY5HsBfB4TMdORnbtVp4wRzXVP7AiVkjM5q1qNrFacU2AzFu19vykw==",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.text();
        console.log("Response from Azure Function:", responseData);
        setTranscription(responseData);
      } else {
        console.error("Error sending the audio to Azure Function.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleTransferFile(droppedFile);
    } else {
      alert("Please drop a valid audio file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (selectedAudio) {
      handleTransferFile(selectedAudio);
    }
  }, [selectedAudio]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={styles.uploadContainer}
    >
      {uploading && <LoadingSpinner />}
    </div>
  );
};

export default LaunchTranscription;
