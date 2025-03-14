import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv4 from "/assets/child/bg-lv4.png";
import baby4 from "/assets/child/baby4.png";

interface Level4Props {
  currentLevel: number;
  totalCount: number;
}

const Level4: React.FC<Level4Props> = ({ currentLevel, totalCount })=> {
  const templateLevel = 4;
  const dynamicAnimation = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [0, -100, 300, 600, 700, -100, 0],
      y: [0, -100, -200, -100, -300, -200, 0],
      transition: {
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <LevelTemplate
      bgImage={bglv4}
      babyImage={baby4}
      profileCss="bottom-56 left-[calc(20%+15px)] transform -translate-x-1/2 w-[190px] z-10 rounded-3xl"
      babyCss="bottom-5 left-[calc(20%+10px)] w-[180px]"
      profileAnimation={dynamicAnimation}
      babyAnimation={dynamicAnimation}
      currentLevel={currentLevel}
      totalCount={totalCount}
      templateLevel={templateLevel}
    />
  );
};

export default Level4;
