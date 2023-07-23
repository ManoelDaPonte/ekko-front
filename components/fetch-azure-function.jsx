import React from 'react';

const FileUploadComponent = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/uploadAudio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // File uploaded successfully
        console.log("File uploaded successfully");
      } else {
        // Error uploading file
        console.error("Error uploading file");
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
