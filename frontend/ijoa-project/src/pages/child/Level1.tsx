import React from "react";
import LevelTemplate from "../../components/child/LevelTemplate";
import bglv1 from "/assets/child/bg-lv1.png";
import baby1 from "/assets/child/baby1.png";
import profile from "/assets/child/profile.png";

const Level1: React.FC = () => {
  // 10초간 좌우로 움직이는 애니메이션
  const sideToSideAnimation = {
    initial: { x: 0 },
    animate: {
      x: [0, 50, -50, 0], // 왼쪽에서 오른쪽으로 이동
      transition: {
        duration: 10, // 10초 동안 진행
        ease: "easeInOut",
      },
    },
  };

  return (
    <LevelTemplate
      bgImage={bglv1}
      profileImage={profile}
      babyImage={baby1}
      profileCss="bottom-40 left-[calc(50%-60px)] transform -translate-x-1/2 w-[160px] z-10 rounded-3xl"
      babyCss="bottom-5 left-[calc(50%-100px)] transform -translate-x-1/2 w-1/6"
      minLevel={2}
      maxLevel={4}
      profileAnimation={sideToSideAnimation} // profileAnimation 설정
      babyAnimation={sideToSideAnimation} // babyAnimation 설정
    />
  );
};

export default Level1;
