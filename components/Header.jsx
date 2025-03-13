import Image from "next/image";
import logo from "../public/images/logo-removebg-preview.png";
import styles from "../styles/Header.module.css";

const Header = () => {
	return (
		<div className={styles.header}>
			<div className={styles.logoContainer}>
				<Image
					src={logo}
					alt="Ekko Logo"
					className={styles.logo}
					priority // Améliore le chargement prioritaire de l'image
				/>
			</div>
		</div>
	);
};

export default Header;
