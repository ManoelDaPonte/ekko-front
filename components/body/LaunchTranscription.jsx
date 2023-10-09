import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/body/LaunchTranscription.module.css";

const LaunchTranscription = ({
  selectedAudio,
  setTranscription,
  selectedCountry,
}) => {
  const [uploading, setUploading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(""); // Step 1: New state variable

  const timeout = (ms) => {
    return new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${ms} ms`)),
        ms
      )
    );
  };

  const determineFunctionUrl = (file) => {
    // Check file type (based on MIME type for simplicity)
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    if (isVideo)
      return "https://first-function-app-mano.azurewebsites.net/api/UploadVideo?code=OA1fpGFHMLEOovpL4sFZGKe0bCgufobl8GY2z6N96om9AzFu__FHuw==";
    if (isAudio)
      return "https://first-function-app-mano.azurewebsites.net/api/UploadAudio?code=hHOvVtha7IpxIm2HPRvLL8sw1auxVPUypy4Yb9w44i6CAzFuaDNeEA==";
    return null; // if file type doesn't match any category
  };

  const callAzureFunction = async (url, formData) => {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok)
      throw new Error("Error sending the file to Azure Function.");

    const responseData = await response.json();
    return responseData.blob_name; // This will return an array of blob names or UUIDs.
  };

  const getTranslation = async (blobName, language) => {
    const payload = {
      blob_name: Array.isArray(blobName) ? blobName : [blobName], // Check if blobName is already an array
      language: language,
    };

    // Log the payload to the console
    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `https://first-function-app-mano.azurewebsites.net/api/UploadTranscription?code=bSsy9GF_Y1_Si7Mhb74jmcAtY5fVsshxoYg98qagcjq_AzFuGsw2OA==`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error fetching translation UUID.");

    const responseData = await response.json();
    return responseData.blob_name;
  };

  const fetchTranslationResult = async (uuid) => {
    const response = await fetch(
      `https://first-function-app-mano.azurewebsites.net/api/DownloadTrancription?code=ppPVPaNIh8s0zO_ImAjhaKQU3qPeeYLU-o6Je0plXYGHAzFuRtqrag==&blob_name=${uuid}`
    );
    if (!response.ok) throw new Error("Error fetching the translation.");

    const responseData = await response.json();
    return responseData.result;
  };

  const handleTransferFile = async (file) => {
    console.log("handleTransferFile invoked");
    try {
      setUploading(true);

      const formDataAudio = new FormData();
      formDataAudio.append("file", file);

      const functionUrl = determineFunctionUrl(file);
      if (!functionUrl) {
        alert("Unsupported file type!");
        return;
      }

      setCurrentStatus("Receiving your file..."); // Step 2: Update the message
      const UUID = await callAzureFunction(functionUrl, formDataAudio);

      setCurrentStatus("Magic's on the way...");
      const translationUUID = await Promise.race([
        getTranslation(UUID, selectedCountry),
        timeout(600000), // 10 minutes = 600,000 milliseconds
      ]);

      setCurrentStatus("Retrieving the result...");
      const translation = await fetchTranslationResult(translationUUID);

      console.log("Translation:", translation);
      setTranscription(translation);
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
      {uploading && <p>{currentStatus}</p>}
    </div>
  );
};

export default LaunchTranscription;
