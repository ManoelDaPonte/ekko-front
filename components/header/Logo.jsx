import Image from "next/image";
import logo from "../../public/images/vassler_The_EKKO_logo_combines_sleek_modernity_with_a_nod_to_th_09f686ca-fef7-47b5-be96-e3784af10edd.png";
import styles from "../../styles/header/Logo.module.css";

const EkkoLogo = () => (
  <div>
    <Image src={logo} alt="Ekko Logo" className={styles.smallImage} />
  </div>
);

export default EkkoLogo;
