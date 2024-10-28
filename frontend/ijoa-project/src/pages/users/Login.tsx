import React from "react";
import Bat from "/assets/user/bat.png";
import Bear from "/assets/user/bear.png";
import Cat from "/assets/user/cat.png";
import Lion from "/assets/user/lion.png";
import Monkey from "/assets/user/monkey.png";
import LoginPicture from "/assets/user/login.png";
import "../../css/Login.css";

const Login: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 로그인 배경화면 */}
      <img src={LoginPicture} alt="로그인 화면" className="absolute inset-0 w-full h-full object-cover z-0" />
      {/* 아이조아 텍스트 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 text-[140px] font-['SDGothic'] text-white-stroke">
        <span className="text-[#FFCC00] ">아</span>
        <span className="text-[#99CC66] ">이</span>
        <span className="text-[#FF6666] ">조</span>
        <span className="text-[#339999] ">아</span>
      </div>
      {/* 동물들 위치조정 */}
      <div className="absolute inset-0 z-20">
        <img src={Bat} alt="박쥐" className="absolute  bottom-40 w-[200px]" />
        <img src={Lion} alt="사자" className="absolute bottom-4 w-[180px]" />
        <img src={Cat} alt="고양이" className="absolute right-0 bottom-40 w-[180px]" />
        <img src={Bear} alt="곰" className="absolute right-0 bottom-4 w-[200px]" />
        <img src={Monkey} alt="원숭이" className="absolute top-1/3 left-[17%] transform -translate-y-1/2 w-[180px]" />
      </div>
      {/* 로그인, 회원가입 버튼 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-16 flex flex-col items-center space-y-4 z-20">
        <button className="w-72 h-20 bg-yellow-400 text-black text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200">
          로그인
        </button>
        <button className="w-72 h-20 bg-orange-500 text-black text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
