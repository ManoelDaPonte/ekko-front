import React, { useEffect, useState } from "react";
import styles from "../../styles/body/Loading.module.css";
import { CircularProgressbar } from "react-circular-progressbar";

const AzureFunctionCaller = ({ selectedAudio, setTranscription }) => {
  const [uploading, setUploading] = useState(false);

  const handleTransferFile = async () => {
    if (selectedAudio) {
      try {
        setUploading(true); // Start the upload
        const formData = new FormData();
        formData.append("audio", selectedAudio);

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
    } else {
      alert("Please select an audio file first.");
    }
  };

  useEffect(() => {
    if (selectedAudio) {
      handleTransferFile(); // Automatically trigger the function if audio is selected
    }
  }, [selectedAudio]);

  return (
    <div className={styles.uploadContainer}>
      {uploading ? (
        <div className={styles.progressContainer}>
          <div className={styles.loadingSpinner} />
          <CircularProgressbar
            value={100}
            styles={{
              path: {
                stroke: "orange", // Custom progress bar color
              },
              text: {
                fill: "orange", // Custom text color />
              },
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AzureFunctionCaller;
