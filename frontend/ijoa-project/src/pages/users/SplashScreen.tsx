import React, { useEffect, useState } from "react";
import Tiger from "/assets/user/tiger.png";
import Elephant from "/assets/user/elephant.png";
import Giraffe from "/assets/user/giraffe.png";
import Tablet from "/assets/user/tablet.png";
// import Logo from "/assets/user/logo.png";
import "../../css/Login.css";

const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1초 후에 fadeOut을 true로 설정하여 서서히 사라지도록 함
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // 2초 동안 대기 후 fadeOut 상태 변경
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash-screen relative w-screen h-screen bg-[#f3fbff] overflow-hidden ${fadeOut ? "fade-out" : ""}`}
    >
      <div className="absolute top-[30%] right-[15%] w-[30vw] flex flex-col items-center">
        <div className="flex space-x-2 text-[140px] font-['SDGothic'] text-white-stroke">
          <span className="text-[#FFCC00] ">아</span>
          <span className="text-[#99CC66] ">이</span>
          <span className="text-[#FF6666] ">조</span>
          <span className="text-[#339999] ">아</span>
        </div>
        <p className="w-full text-center font-semibold text-2xl mt-4">엄마, 아빠가 읽어주는 동화책</p>
      </div>

      <div className="flex items-end absolute left-[10%] bottom-[15%] gap-[0vw] z-10">
        <img src={Tiger} alt="호랑이" className="character w-[12vw] mb-[17vw] -ml-[3vw]" />
        <img src={Elephant} alt="코끼리" className="character w-[12vw] mb-[20vw] -ml-[3vw]" />
        <img src={Giraffe} alt="기린" className="character w-[12vw] mb-[23vw] -ml-[3vw]" />
      </div>

      <img src={Tablet} alt="태블릿 화면" className="absolute bottom-[5%] w-[45vw] translate-y-[10%]" />
    </div>
  );
};

export default SplashScreen;
