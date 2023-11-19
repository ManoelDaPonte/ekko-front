import { ScaleLoader } from "react-spinners";

const LoadingSpinner = () => {
    return (
        <ScaleLoader
            color={"#c7770c"}
            loading={true}
            width={"1vw"}
            height={"5vw"}
            radius={6}
        />
    );
};

export default LoadingSpinner;
