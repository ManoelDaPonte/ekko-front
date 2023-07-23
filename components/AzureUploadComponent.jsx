import React from "react";

const FileUploadComponent = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    try {
      // Request the pre-signed URL or SAS token from the API route
      const response = await fetch(`/api/createUploadToken?filename=${file.name}`);
      const data = await response.json();

      if (response.ok) {
        // Upload the file directly to Azure Blob Storage
        await fetch(data.uploadUrl, {
          method: "PUT",
          body: file,
        });

        // File uploaded successfully
        console.log("File uploaded successfully");
      } else {
        // Error obtaining the upload URL or SAS token
        console.error("Error obtaining the upload URL or SAS token");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUploadComponent;