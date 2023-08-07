import React from "react";

const AzureFunctionCaller = ({ selectedAudio, setTranscription }) => {
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
    <button onClick={handleTransferFile} disabled={!selectedAudio}>
      Go
    </button>
  );
};

export default AzureFunctionCaller;
