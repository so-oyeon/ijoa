import React, { useState } from "react";
import LevelInfoModal from "../../components/child/LevelInfoModal";

interface LevelTemplateProps {
  bgImage: string;
  profileImage: string;
  babyImage: string;
  babyCss: string;
  profileCss: string;
  minLevel?: number;
  maxLevel?: number;
}

const LevelTemplate: React.FC<LevelTemplateProps> = ({
  bgImage,
  profileImage,
  babyImage,
  babyCss: babyPosition,
  profileCss: profilePosition,
  minLevel,
  maxLevel,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img src={bgImage} alt="배경화면" className="w-full h-screen object-cover" />
      <img src={profileImage} alt="프로필이미지" className={`absolute ${profilePosition}`} />
      <img src={babyImage} alt="애기 이미지" className={`absolute ${babyPosition}`} />

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
