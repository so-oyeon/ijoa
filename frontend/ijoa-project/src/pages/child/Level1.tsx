import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv1 from "/assets/child/bg-lv1.png";
import baby1 from "/assets/child/baby1.png";
import profile from "/assets/child/profile.png";

const Level1: React.FC = () => {
  return (
    <LevelTemplate
      bgImage={bglv1}
      profileImage={profile}
      babyImage={baby1}
      profileCss="bottom-40 left-[calc(50%+12px)] transform -translate-x-1/2 w-[160px] z-10 rounded-3xl"
      babyCss="bottom-5 left-1/2 transform -translate-x-1/2 w-1/6"
      minLevel={2}
      maxLevel={4}
    />
  );
};

export default Level1;
