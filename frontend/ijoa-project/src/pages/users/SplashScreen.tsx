import React, { useEffect, useState } from "react";
import Tablet from "/assets/user/tablet2.png";
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
      <div className="absolute top-[10%] sm:top-[30%] right-[10%] sm:right-[15%] w-[70vw] sm:w-[50vw] md:w-[30vw] flex flex-col items-center">
        <div className="flex space-x-1 sm:space-x-2 text-[60px] sm:text-[100px] lg:text-[140px] font-['SDGothic'] text-white-stroke">
          <span className="text-[#FFCC00]">아</span>
          <span className="text-[#99CC66]">이</span>
          <span className="text-[#FF6666]">조</span>
          <span className="text-[#339999]">아</span>
        </div>
        <p className="w-full font-['MapleBold'] text-center font-semibold text-[#565656] text-md sm:text-lg md:text-xl lg:text-4xl tracking-widest whitespace-nowrap">
          엄마, 아빠가 읽어주는 동화책
        </p>
      </div>

      <img
        src={Tablet}
        alt="태블릿 화면"
        className="absolute -bottom-[10%] sm:-bottom-[20%] -left-[10%] sm:-left-[5%] w-[80vw] sm:w-[60vw] md:w-[40vw] translate-y-[10%]"
      />
    </div>
  );
};

export default SplashScreen;
