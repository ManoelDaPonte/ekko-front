import Header from "../components/header/Header";
import Body from "../components/body/Body";
import Footer from "../components/footer/Footer";
import styles from "../styles/app.module.css";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;
