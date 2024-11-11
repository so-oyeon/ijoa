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
      <div className="absolute top-[25%] right-[10%] w-[60vw] md:w-[40vw] lg:w-[30vw] flex flex-col items-center">
        <div className="flex space-x-2 text-[15vw] md:text-[10vw] lg:text-[8vw] font-['SDGothic'] text-white-stroke">
          <span className="text-[#FFCC00]">아</span>
          <span className="text-[#99CC66]">이</span>
          <span className="text-[#FF6666]">조</span>
          <span className="text-[#339999]">아</span>
        </div>
        <p className="w-full font-['MapleBold'] text-center font-semibold text-[#565656] text-[4vw] md:text-2xl lg:text-3xl tracking-widest">
          엄마, 아빠가 읽어주는 동화책
        </p>
      </div>

      {/* 동물 이미지 */}
      <div className="flex items-end absolute left-[5%] bottom-[15%] gap-[2vw] md:gap-[1vw] z-10">
        <img src={Tiger} alt="호랑이" className="character w-[15vw] md:w-[10vw] lg:w-[8vw] mb-[13vw] -ml-[3vw]" />
        <img src={Elephant} alt="코끼리" className="character w-[15vw] md:w-[10vw] lg:w-[8vw] mb-[16vw] -ml-[3vw]" />
        <img src={Giraffe} alt="기린" className="character w-[15vw] md:w-[10vw] lg:w-[8vw] mb-[19vw] -ml-[3vw]" />
      </div>

      {/* 태블릿 이미지 */}
      <img
        src={Tablet}
        alt="태블릿 화면"
        className="absolute bottom-[5%] w-[50vw] md:w-[40vw] lg:w-[35vw] translate-y-[10%]"
      />
    </div>
  );
};

export default SplashScreen;
