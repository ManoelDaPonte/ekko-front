import AudioSelectAndProcess from "../components/audio/AudioSelectAndProcess";
import Logo from "../components/header/Logo";
import Button from "../components/Button";

import styles from "../styles/App.module.css";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <Logo />
        <div className={styles.group}>
          <Button
            name="Log In"
            backgroundColor="#007bff"
            backgroundColorHover="#0056b3"
          ></Button>
          <Button
            name="Sign Up"
            backgroundColor="#38B000"
            backgroundColorHover="#006400"
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
