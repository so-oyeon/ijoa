import React from "react";
import bglv4 from "/assets/child/bg-lv4.png";
import baby4 from "/assets/child/baby4.png";
import profile from "/assets/child/profile.png";

const Level4: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img src={bglv4} alt="배경화면" className="w-full h-screen object-cover" />
      <img
        src={profile}
        alt="프로필이미지"
        className="absolute bottom-56 left-[calc(30%+20px)] transform -translate-x-1/2 w-[190px] z-10 rounded-3xl"
      />
      <img src={baby4} alt="애기1" className="absolute bottom-5 left-80 w-[180px]" />
      
    </div>
  );
};

export default Level4;
