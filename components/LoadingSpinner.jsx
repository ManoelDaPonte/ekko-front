import React from "react";
import { ScaleLoader } from "react-spinners";
import styles from "../styles/LoadingSpinner.module.css";

const LoadingSpinner = () => {
	return (
		<div className={styles.loadingContainer}>
			<ScaleLoader
				color={"#ff8c2b"}
				loading={true}
				width={"6px"}
				height={"35px"}
				radius={2}
				margin={2}
			/>
			<div className={styles.loadingPulse}></div>
		</div>
	);
};

export default LoadingSpinner;
