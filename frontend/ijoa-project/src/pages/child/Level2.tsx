import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv2 from "/assets/child/bg-lv2.png";
import baby2 from "/assets/child/baby2.png";
import profile from "/assets/child/profile.png";

const Level2: React.FC = () => {
  return (
    <LevelTemplate
      bgImage={bglv2}
      profileImage={profile}
      babyImage={baby2}
      profileCss="bottom-24 left-[calc(50%-60px)] transform -translate-x-1/2 w-[160px] z-10 rounded-3xl"
      babyCss="bottom-5 left-1/2 transform -translate-x-1/2 w-[300px]"
      minLevel={3}
      maxLevel={4}
    />
  );
};

export default Level2;
