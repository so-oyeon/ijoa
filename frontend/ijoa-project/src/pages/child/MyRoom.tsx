import React, { useState } from "react";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";

const MyRoom: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1); // 초기 레벨

  // 다음 레벨로 이동하는 함수
  const goToNextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  // 이전 레벨로 이동하는 함수
  const goToPreviousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  // 현재 레벨에 따른 컴포넌트 선택
  const renderLevelComponent = () => {
    switch (currentLevel) {
      case 1:
        return <Level1 />;
      case 2:
        return <Level2 />;
      case 3:
        return <Level3 />;
      case 4:
        return <Level4 />;
      default:
        return <Level1 />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {renderLevelComponent()}

      {/* 이전 레벨로 이동 버튼 */}
      {currentLevel > 1 && (
        <button
          onClick={goToPreviousLevel}
          className="absolute bottom-10 left-10 px-4 py-2 bg-gray-500 text-white rounded-md shadow-md"
        >
          이전 레벨로 이동
        </button>
      )}

      {/* 다음 레벨로 이동 버튼 */}
      {currentLevel < 4 && (
        <button
          onClick={goToNextLevel}
          className="absolute bottom-10 right-10 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md"
        >
          다음 레벨로 이동
        </button>
      )}
    </div>
  );
};

export default MyRoom;
