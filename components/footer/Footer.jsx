import Button from "../Button";
import styles from "../../styles/footer/Footer.module.css";

const footer = () => {
  return (
    <div className={styles.footer}>
      <Button
        name="Condition d'utilisation"
        backgroundColor="rgba(0, 0, 0, 0)"
        backgroundColorHover="rgba(0, 0, 0, 0)"
      ></Button>
      <Button
        name="Mentions légales"
        backgroundColor="rgba(0, 0, 0, 0)"
        backgroundColorHover="rgba(0, 0, 0, 0)"
      ></Button>
      <Button
        name="About me"
        backgroundColor="rgba(0, 0, 0, 0)"
        backgroundColorHover="rgba(0, 0, 0, 0)"
      ></Button>
    </div>
  );
};
export default footer;
