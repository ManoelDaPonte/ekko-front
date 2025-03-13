import Header from "../components/Header";
import BodyTranscription from "../components/BodyTranscription";
import styles from "../styles/app.module.css";

const App = () => {
	return (
		<div className={styles.appContainer}>
			<Header />
			<div className={styles.spacer}>
				<BodyTranscription />
			</div>
		</div>
	);
};

export default App;
