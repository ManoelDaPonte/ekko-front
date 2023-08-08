import Image from "next/image";
import logo from "../../public/images/logo-removebg-preview.png";
import styles from "../../styles/header/Logo.module.css";

const EkkoLogo = () => (
  <div>
    <Image src={logo} alt="Ekko Logo" className={styles.smallImage} />
  </div>
);

export default EkkoLogo;
