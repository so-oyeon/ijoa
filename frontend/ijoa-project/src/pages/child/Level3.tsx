import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv3 from "/assets/child/bg-lv3.png";
import baby3 from "/assets/child/baby3.png";

interface Level3Props {
  currentLevel: number;
  totalCount: number;
}

const Level3: React.FC<Level3Props> = ({ currentLevel, totalCount })=> {
  const templateLevel = 3;
  const profileAnimation = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [-100, -800, -600, -100],
      y: [-10, -40, -20, 0], 
      transition: {
        duration: 10,
        ease: "easeInOut", 
        times: [0, 0.3, 0.4, 1], 
      },
    },
  };

  const babyAnimation = {
    initial: { x: 0, y: 0, scaleX: 1 },
    animate: {
      x: [-100, -800, -600, -100], 
      y: [-10, -40, -20, 0], 
      scaleX: [1, 1, -1, -1],
      transition: {
        duration: 10,
        ease: "easeInOut", 
        times: [0, 0.3, 0.4, 1], 
      },
    },
  };

  return (
    <LevelTemplate
      bgImage={bglv3}
      babyImage={baby3}
      profileCss="bottom-56 right-[calc(10%+140px)] transform -translate-x-1/2 z-10 rounded-3xl"
      babyCss="bottom-5 right-[calc(10%+60px)] transform -translate-x-1/2 w-[320px]"
      minLevel={4}
      maxLevel={4}
      babyAnimation={babyAnimation} 
      profileAnimation={profileAnimation}
      currentLevel={currentLevel}
      totalCount={totalCount}
      templateLevel={templateLevel}
    />
  );
};

export default Level3;
