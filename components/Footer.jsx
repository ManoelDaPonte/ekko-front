import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import styles from "../styles/Footer.module.css";

const Footer = () => {
	return (
		<div className={styles.footer}>
			<div className={styles.footerLinks}>
				<a href="#" className={styles.link}>
					Terms of Service
				</a>
				<a href="#" className={styles.link}>
					Privacy Policy
				</a>
				<a href="#" className={styles.link}>
					About
				</a>
			</div>

			<div className={styles.copyright}>
				© {new Date().getFullYear()} Ekko - Audio Transcription Tool
			</div>

			<div className={styles.socialLinks}>
				<a href="#" className={styles.socialIcon} title="GitHub">
					<FaGithub />
				</a>
				<a href="#" className={styles.socialIcon} title="LinkedIn">
					<FaLinkedin />
				</a>
				<a href="#" className={styles.socialIcon} title="Contact">
					<FaEnvelope />
				</a>
			</div>
		</div>
	);
};

export default Footer;
