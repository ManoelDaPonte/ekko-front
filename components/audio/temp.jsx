import React, { useState } from "react";

const AudioSelectAndProcess = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [transcription, setTranscription] = useState("");

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

  const handleTransferFile = async () => {
    if (selectedAudio) {
      try {
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
          setSelectedAudio(null); // Clear the selected audio after transfer
        } else {
          console.error("Error sending the audio to Azure Function.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please select an audio file first.");
    }
  };

  return (
    <div className="audio-uploader">
      <div
        className="audio-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedAudio ? (
          <div>
            <h3>Selected Audio:</h3>
            <p>{selectedAudio.name}</p>
          </div>
        ) : (
          <p>Drag and drop an audio file (.wav) here</p>
        )}
      </div>
      <input
        type="file"
        accept=".wav"
        onChange={handleFileChange}
        style={{ marginTop: "20px" }}
      />
      <button onClick={handleTransferFile} disabled={!selectedAudio}>
        Transfer File
      </button>
      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioSelectAndProcess;
