import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv2 from "/assets/child/bg-lv2.png";
import baby2 from "/assets/child/baby2.png";

interface Level2Props {
  currentLevel: number;
  totalCount: number;
}

const Level2: React.FC<Level2Props> = ({ currentLevel, totalCount }) => {
  const templateLevel = 2;
  const profileAnimation = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [-100, -800, -300, -60],
      y: [0, 20, -10, 0],
      transition: {
        duration: 10,
        ease: "easeInOut",
        times: [0, 0.6, 0.7, 1],
      },
    },
  };

  const babyAnimation = {
    initial: { x: 0, y: 0, scaleX: 1 },
    animate: {
      x: [-100, -800, -450, -200],
      y: [0, 20, -10, 0],
      scaleX: [1, 1, -1, -1],
      transition: {
        duration: 10,
        ease: "easeInOut",
        times: [0, 0.6, 0.7, 1],
      },
    },
  };

  return (
    <LevelTemplate
      bgImage={bglv2}
      babyImage={baby2}
      profileCss="bottom-24 left-[calc(50%+200px)] transform -translate-x-1/2 w-[160px] z-10 rounded-3xl"
      babyCss="bottom-5 left-[calc(50%+200px)] transform -translate-x-1/2 w-[300px]"
      minLevel={3}
      maxLevel={4}
      babyAnimation={babyAnimation}
      profileAnimation={profileAnimation}
      currentLevel={currentLevel}
      totalCount={totalCount}
      templateLevel={templateLevel}
    />
  );
};

export default Level2;
