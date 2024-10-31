import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv4 from "/assets/child/bg-lv4.png";
import baby4 from "/assets/child/baby4.png";
import profile from "/assets/child/profile.png";

const Level4: React.FC = () => {
  return (
    <LevelTemplate
      bgImage={bglv4}
      profileImage={profile}
      babyImage={baby4}
      profileCss="bottom-56 left-[calc(30%+20px)] transform -translate-x-1/2 w-[190px] z-10 rounded-3xl"
      babyCss=" bottom-5 left-80 w-[180px]"
    />
  );
};

export default Level4;
