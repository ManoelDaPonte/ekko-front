import React from "react";
import Meta from "../components/Meta";
import Header from "../components/Header";
import BodyTranscription from "../components/BodyTranscription";
import Footer from "../components/Footer";
import styles from "../styles/app.module.css";

const App = () => {
	return (
		<>
			<Meta
				title="Ekko | Audio Transcription Tool"
				description="Transform your audio and video files into accurate text transcriptions with Ekko. Fast, easy, and reliable audio-to-text conversion."
			/>

			<div className={styles.appContainer}>
				<Header />
				<main className={styles.main}>
					<BodyTranscription />
				</main>
				<Footer />
			</div>
		</>
	);
};

export default App;
