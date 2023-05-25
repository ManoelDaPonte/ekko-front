import axios from 'axios';
import { useState } from 'react';

export default function FetchDataAzureFunction() {
  const [responseData, setResponseData] = useState('');
  const apiKey = 'TY5HsBfB4TMdORnbtVp4wRzXVP7AiVkjM5q1qNrFacU2AzFu19vykw=='; // Replace with your actual API key
  const config = {
    headers: {'x-functions-key': apiKey}
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('https://first-function-app-mano.azurewebsites.net/api/first-function-app?code=TY5HsBfB4TMdORnbtVp4wRzXVP7AiVkjM5q1qNrFacU2AzFu19vykw==&name=Nina', config);
      setResponseData(response.data); // Update state with response data
      console.log(response.data); // Handle the response data
    } catch (error) {
      console.error(error); // Handle any errors
      return (
        <div>
          <button>Call Azure Function</button>
        </div>
      )
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Call Azure Function</button>
      <p>{responseData}</p>
    </div>
  );
}