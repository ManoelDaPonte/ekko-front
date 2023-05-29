const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);
  
    const response = await fetch("https://first-function-app-mano.azurewebsites.net/api/first-function-app?code=TY5HsBfB4TMdORnbtVp4wRzXVP7AiVkjM5q1qNrFacU2AzFu19vykw==", {
      method: "POST",
      body: formData,
    });
  
    if (response.ok) {
      const result = await response.text();
      console.log(result); // Speech-to-text result
    } else {
      console.error("Error occurred while uploading file.");
    }
  };
  