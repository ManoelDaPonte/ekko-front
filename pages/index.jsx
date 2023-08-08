import AudioSelectAndProcess from "../components/body/Body";
import Logo from "../components/header/Logo";
import Button from "../components/Button";
import styles from "../styles/app.module.css";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <Logo />
        <div className={styles.group}>
          <Button
            name="Log In"
            backgroundColor="rgba(0, 0, 0, 0)"
            backgroundColorHover="rgba(0, 0, 0, 0)"
          ></Button>
          <Button
            name="Sign Up"
            backgroundColor="rgb(10, 10, 10, 0.3)"
            backgroundColorHover="rgb(10, 10, 10, 0.7)"
          ></Button>
        </div>
      </div>

      <div className={styles.body}>
        <AudioSelectAndProcess />
      </div>
    </div>
  );
};

export default App;
