import React from "react";
import styles from "../styles/SideBar.module.css";
import home from "../public/images/home.png";
import Image from "next/image";

const SideBar = () => {
    return (
        <div className={styles.sideBar}>
            <Image src={home} alt="home" width={50} height={50} />
        </div>
    );
};

export default SideBar;
