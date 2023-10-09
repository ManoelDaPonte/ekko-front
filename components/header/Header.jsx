import Button from "../Button";
import Logo from "./Logo";
import styles from "../../styles/header/Header.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const [hover, setHover] = useState(false);
  const [hoverSignIn, setHhoverSignIn] = useState(false);

  if (session) {
    return (
      <div className={styles.header}>
        <Logo />
        <div className={styles.group}>
          <button
            className={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              backgroundColor: hover
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0)",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.header}>
      <Logo />
      <div className={styles.group}>
        <button
          onMouseEnter={() => setHhoverSignIn(true)}
          onMouseLeave={() => setHhoverSignIn(false)}
          className={styles.button}
          onClick={() => signIn()}
          style={{
            backgroundColor: hoverSignIn
              ? "rgb(10, 10, 10, 0.7)"
              : "rgb(10, 10, 10, 0.3)",
          }}
        >
          Sign in
        </button>
        <button
          className={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor: hover ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0)",
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Header;
