import Header from "../components/Header";
import BodyTranscription from "../components/BodyTranscription";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import styles from "../styles/app.module.css";

const App = () => {
    return (
        <div className={styles.appContainer}>
            <Header />
            <div className={styles.spacer}>
                <SideBar />
                <BodyTranscription />
            </div>
        </div>
    );
};

export default App;
