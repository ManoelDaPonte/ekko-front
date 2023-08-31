import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/body/LaunchTranscription.module.css";

const LaunchTranscription = ({
  selectedAudio,
  setTranscription,
  selectedCountry,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleTransferFile = async (audioFile) => {
    try {
      setUploading(true); // Start the upload
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", selectedCountry || "");
      console.log(selectedCountry);

      const response = await fetch(
        "https://first-function-app-mano.azurewebsites.net/api/AudioTranscriptionAndSave?code=Qm6gpIlqsZ8xfqOyIQriQbOIEK8iSKWjriYCp5jBekCLAzFuL7OTdg==",
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
