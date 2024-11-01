import React, { useState, useEffect } from "react";
import { motion, MotionProps } from "framer-motion";
import LevelInfoModal from "../../components/child/LevelInfoModal";

interface LevelTemplateProps {
  bgImage: string;
  profileImage: string;
  babyImage: string;
  babyCss: string;
  profileCss: string;
  minLevel?: number;
  maxLevel?: number;
  babyAnimation?: MotionProps;
  profileAnimation?: MotionProps;
}

const LevelTemplate: React.FC<LevelTemplateProps> = ({
  bgImage,
  profileImage,
  babyImage,
  babyCss,
  profileCss,
  minLevel,
  maxLevel,
  babyAnimation,
  profileAnimation,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [loopAnimation, setLoopAnimation] = useState(false);

  // 무한 반복 애니메이션
  const infiniteVerticalAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };

  // 초기 애니메이션이 끝난 후 무한 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => setLoopAnimation(true), 10000); // 초기 애니메이션이 10초 동안 진행됨
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img src={bgImage} alt="배경화면" className="w-full h-screen object-cover" />

      {/* 프로필 이미지 애니메이션 */}
      <motion.div
        initial="initial"
        animate={loopAnimation ? infiniteVerticalAnimation : profileAnimation?.animate}
        className={`absolute ${profileCss}`}
      >
        <img src={profileImage} alt="프로필 이미지" className="w-full h-full" />
      </motion.div>

      {/* 아기 이미지 애니메이션 */}
      <motion.div
        initial="initial"
        animate={loopAnimation ? infiniteVerticalAnimation : babyAnimation?.animate}
        className={`absolute ${babyCss}`}
      >
        <img src={babyImage} alt="아기 이미지" className="w-full h-full" />
      </motion.div>

      {/* 정보 버튼 */}
      {minLevel && maxLevel && (
        <button
          onClick={() => setIsInfoVisible(true)}
          className="absolute bottom-[-12px] left-10 px-2 py-3 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md"
        >
          <span className="text-xs text-white">정보</span>
          <img src="/assets/child/info-button.png" alt="정보버튼" />
        </button>
      )}

      {/* 모달 화면 */}
      {isInfoVisible && minLevel && maxLevel && (
        <LevelInfoModal minLevel={minLevel} maxLevel={maxLevel} onClose={() => setIsInfoVisible(false)} />
      )}
    </div>
  );
};

export default LevelTemplate;
