import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv3 from "/assets/child/bg-lv3.png";
import baby3 from "/assets/child/baby3.png";
import profile from "/assets/child/profile.png";

const Level3: React.FC = () => {
  return (
    <LevelTemplate
      bgImage={bglv3}
      profileImage={profile}
      babyImage={baby3}
      profileCss="bottom-56 right-[calc(10%+60px)] transform -translate-x-1/2 w-[180px] z-10 rounded-3xl"
      babyCss="bottom-5 right-10 transform -translate-x-1/2 w-[320px]"
      minLevel={4}
      maxLevel={4}
    />
  );
};

export default Level3;
