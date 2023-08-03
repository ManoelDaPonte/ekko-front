import React, { useState } from "react";
import AudioUploader from "../components/AudioUploader";
import Title from "../components/Title";
import LogInButton from "../components/ButtonIdentifier";
import SignInButton from "../components/ButtonIdentifier2";
import style from "../styles/app.module.css";

const App = () => {
  return (
    <div className={style.appContainer}>
      <div className={style.header}>
        <Title></Title>
        <LogInButton></LogInButton>
        <SignInButton></SignInButton>
      </div>

      <div>
        <h1>Audio Uploader</h1>
        <AudioUploader />
      </div>
    </div>
  );
};

export default App;
