import React, { useEffect, useState } from "react";
import Tiger from "/assets/user/tiger.png";
import Elephant from "/assets/user/elephant.png";
import Giraffe from "/assets/user/giraffe.png";
import Tablet from "/assets/user/tablet.png";
import "../../css/Login.css";

const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash-screen relative w-screen h-screen bg-[#f3fbff] overflow-hidden ${fadeOut ? "fade-out" : ""}`}
    >
      {/* 로고 텍스트 */}
      <div className="absolute top-[25%] right-[10%] w-[40vw] md:w-[30vw] lg:w-[40vw] flex flex-col items-center">
        <div className="flex space-x-2 text-[10vw] font-['SDGothic'] text-white-stroke">
          <span className="text-[#FFCC00]">아</span>
          <span className="text-[#99CC66]">이</span>
          <span className="text-[#FF6666]">조</span>
          <span className="text-[#339999]">아</span>
        </div>
        <p className="w-full font-['MapleBold'] text-center font-semibold text-[#565656] md:text-xl lg:text-2xl tracking-widest">
          엄마, 아빠가 읽어주는 동화책
        </p>
      </div>

      {/* 태블릿 및 동물 이미지 컨테이너 */}
      <div className="relative flex items-end justify-center w-full h-full">
        {/* 동물 이미지 */}
        <div className="flex items-end absolute left-[22%] bottom-[16%] transform -translate-x-1/2 z-20">
          <img src={Tiger} alt="호랑이" className="w-1/3 mb-[18vw]" />
          <img src={Elephant} alt="코끼리" className="w-1/3 mb-[21vw]" />
          <img src={Giraffe} alt="기린" className="w-1/3 mb-[25vw]" />
        </div>

        {/* 태블릿 이미지 */}
        <img src={Tablet} alt="태블릿 화면" className="absolute left-0 bottom-10 w-1/2 translate-y-[10%]" />
      </div>
    </div>
  );
};

export default SplashScreen;
