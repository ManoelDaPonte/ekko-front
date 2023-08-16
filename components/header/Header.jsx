import Button from "../Button";
import Logo from "./Logo";
import styles from "../../styles/header/Header.module.css";

const Header = () => {
  return (
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
  );
};

export default Header;
