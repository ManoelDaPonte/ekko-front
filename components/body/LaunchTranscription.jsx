import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "../../styles/body/LaunchTranscription.module.css";

const LaunchTranscription = ({
  selectedAudio,
  setTranscription,
  selectedCountry,
}) => {
  const [uploading, setUploading] = useState(false);

  const determineFunctionUrl = (file) => {
    // Check file type (based on MIME type for simplicity)
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    // Check file size
    const isLarge = file.size > 23 * 1024 * 1024; // 23 MB in bytes

    if (isVideo)
      return "https://first-function-app-mano.azurewebsites.net/api/UploadVideo?code=OA1fpGFHMLEOovpL4sFZGKe0bCgufobl8GY2z6N96om9AzFu__FHuw==";
    if (isAudio && isLarge)
      return "https://first-function-app-mano.azurewebsites.net/api/UploadLargeFile?code=usY-fUZF-nRIw5SJk2HwMD4K1u5ukAyD_3kFPkUTz675AzFuuKHPuA==";
    if (isAudio && !isLarge)
      return "https://first-function-app-mano.azurewebsites.net/api/UploadSmallFile?code=HsHSFrnMLCXBKZzSpv1v_65EA4swobp6yyBvHQ36c4kTAzFuV3t8dg==";

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

  const handleTransferFile = async (audioFile) => {
    console.log("handleTransferFile invoked");
    try {
      setUploading(true);

      const formDataAudio = new FormData();
      formDataAudio.append("file", audioFile);

      const functionUrl = determineFunctionUrl(audioFile);
      if (!functionUrl) {
        alert("Unsupported file type!");
        return;
      }

      const UUID = await callAzureFunction(functionUrl, formDataAudio);
      const translationUUID = await getTranslation(UUID, selectedCountry);
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
    </div>
  );
};

export default LaunchTranscription;
