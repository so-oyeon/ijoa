import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/footPrint-loadingAnimation.json";

const LoadingAnimation = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
    </div>
  );
};

export default LoadingAnimation;
