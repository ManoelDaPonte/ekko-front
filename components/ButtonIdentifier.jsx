import style from "../styles/ButtonHeader.module.css";

const LogInButton = () => {
  return (
    <div className={style.buttonContainer}>
      <button
        className={style.logInButton}
        onClick={() => console.log("LogIn Clicked")}
      >
        LogIn
      </button>
    </div>
  );
};

export default LogInButton;
