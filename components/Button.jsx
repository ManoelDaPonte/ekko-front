import React, { useState } from "react";
import styles from "../styles/Button.module.css";

const Button = ({ name, backgroundColor, backgroundColorHover }) => {
  const [hover, setHover] = useState(false);

  const buttonStyles = {
    backgroundColor: hover ? backgroundColorHover : backgroundColor,
  };

  return (
    <div>
      <button
        style={buttonStyles}
        className={styles.button}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;


