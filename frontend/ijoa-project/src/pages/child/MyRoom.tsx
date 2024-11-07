import React, { useEffect, useState } from "react";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import { childApi } from "../../api/childApi";
import arrow_left from "/assets/child/gamearrow_left.png";
import arrow_right from "/assets/child/gamearrow_right.png";

const MyRoom: React.FC = () => {
  const [initialLevel, setInitialLevel] = useState(1); // DB에서 가져온 초기 레벨
  const [displayLevel, setDisplayLevel] = useState(1); // 화면에 표시되는 레벨
  const [totalCount, setTotalCount] = useState(0);
  const [maxLevel, setMaxLevel] = useState(1);

  useEffect(() => {
    // 자녀의 현재 레벨을 불러오는 함수
    const ChildLevel = async () => {
      try {
        const response = await childApi.getLevel();
        const data = response.data;
        setInitialLevel(data.level);
        setDisplayLevel(data.level);
        setTotalCount(data.totalCount);
        setMaxLevel(data.level);
      } catch (error) {
        console.error("childApi의 ChildLevel:", error);
      }
    };

    ChildLevel();
  }, []);

  // 다음 레벨로 이동하는 함수
  const goToNextLevel = () => {
    if (displayLevel < maxLevel) {
      setDisplayLevel(displayLevel + 1);
    }
  };

  // 이전 레벨로 이동하는 함수
  const goToPreviousLevel = () => {
    if (displayLevel > 1) {
      setDisplayLevel(displayLevel - 1);
    }
  };

  // 현재 레벨에 따른 컴포넌트 선택
  const renderLevelComponent = () => {
    switch (displayLevel) {
      case 1:
        return <Level1 currentLevel={initialLevel} totalCount={totalCount} />;
      case 2:
        return <Level2 currentLevel={initialLevel} totalCount={totalCount} />;
      case 3:
        return <Level3 currentLevel={initialLevel} totalCount={totalCount} />;
      case 4:
        return <Level4 currentLevel={initialLevel} totalCount={totalCount} />;
      default:
        return <Level1 currentLevel={initialLevel} totalCount={totalCount} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {renderLevelComponent()}

      {/* 이전 레벨로 이동 버튼 */}
      {displayLevel > 1 && (
        <button
          onClick={goToPreviousLevel}
          className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-md"
        >
          <img src={arrow_left} alt="이전 레벨" className="w-[200px]" />
        </button>
      )}

      {/* 다음 레벨로 이동 버튼 */}
      {displayLevel < maxLevel && (
        <button
          onClick={goToNextLevel}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-md"
        >
          <img src={arrow_right} alt="다음 레벨" className="w-[200px]"/>
        </button>
      )}
    </div>
  );
};

export default MyRoom;
