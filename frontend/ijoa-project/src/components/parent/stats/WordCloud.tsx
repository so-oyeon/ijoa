import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

const WordCloud = () => {
  return (
    <div className="pt-5 flex flex-col relative">
      <div className="grow p-3 border-4 border-[#F5F5F5] rounded-2xl">
        <p className="w-2/3 py-2 text-center font-semibold bg-[#B1EBAB] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2">
          이런 책이 재밌어요
        </p>

        <div className="w-full h-full flex flex-col justify-center items-center">
          <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
          <p>조회된 데이터가 없습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
