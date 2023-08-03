import style from "../styles/buttonHeader.module.css";

const SignInButton = () => {
  return (
    <div className={style.buttonContainer}>
      <button
        className={style.signInButton}
        onClick={() => console.log("Sign In Clicked")}
      >
        Sign In
      </button>
    </div>
  );
};

export default SignInButton;
