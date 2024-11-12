import React, { useState } from "react";
import baby2 from "/assets/child/baby2.png";
import baby3 from "/assets/child/baby3.png";
import baby4 from "/assets/child/baby4.png";
import lock from "/assets/child/lock.png";
import left_arrow from "/assets/fairytales/buttons/left-arrow.png";
import right_arrow from "/assets/fairytales/buttons/right-arrow.png";
import closebutton from "/assets/close-button.png";

interface LevelModalProps {
  minLevel: number;
  maxLevel: number;
  currentLevel: number;
  totalCount: number;
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ minLevel, maxLevel, totalCount, onClose }) => {
  const [currentModalLevel, setCurrentModalLevel] = useState(minLevel);

  const goToPreviousModalLevel = () => {
    if (currentModalLevel > minLevel) {
      setCurrentModalLevel(currentModalLevel - 1);
    }
  };

  const goToNextModalLevel = () => {
    if (currentModalLevel < maxLevel) {
      setCurrentModalLevel(currentModalLevel + 1);
    }
  };

  const renderModalContent = () => {
    const babyImage = currentModalLevel === 2 ? baby2 : currentModalLevel === 3 ? baby3 : baby4;

    const unlockText =
      currentModalLevel - 1 === 1 ? (
        <span className="whitespace-pre-line font-bold text-2xl">
          {"다음 단계로 가려면 \n"}
          <span className="text-purple-600 text-3xl font-bold">1권</span>을 더 읽으면 돼요!
        </span>
      ) : currentModalLevel - 1 === 2 ? (
        <span className="whitespace-pre-line font-bold text-2xl">
          {"다음 단계로 가려면 \n"}
          <span className="text-purple-600 text-3xl font-bold">{6 - totalCount}권</span>을 더 읽으면 돼요!
        </span>
      ) : (
        <span className="whitespace-pre-line font-bold text-2xl">
          {"다음 단계로 가려면 \n"}
          <span className="text-purple-600 text-3xl font-bold">{11 - totalCount}권</span>을 더 읽으면 돼요!
        </span>
      );

    return (
      <div className="text-center font-['MapleLight']">
        <div className="relative inline-block w-64 h-64">
        <p className="mt-5 font-semibold text-lg whitespace-pre-line">{"읽은 책 수에 따라\n나의 레벨이 올라가요!"}</p>
          <img
            src={babyImage}
            alt={`LV${currentModalLevel} 이미지`}
            className="w-full h-full filter brightness-50 object-contain mt-3 pb-10"
          />
          <img
            src={lock}
            alt="잠금 아이콘"
            className="absolute w-[100px] h-auto top-[200px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <p className="mt-20 font-semilbold text-2xl">{unlockText}</p>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 font-['MapleLight']">
      <div className="relative bg-[#FCFFEA] p-10 rounded-2xl shadow-lg w-1/2 max-w-2xl text-center">
       
        <p className="mt-3 font-bold text-black text-2xl yellow-highlight">
            {currentModalLevel === 2 ? "LV2.책아장" : currentModalLevel === 3 ? "LV3.책린이" : "LV4.독서왕"}
          </p>
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={closebutton} alt="Close" />
        </button>
        <div className="flex items-center justify-center gap-x-8 mb-6">
          <button
            onClick={goToPreviousModalLevel}
            style={{ visibility: currentModalLevel > minLevel ? "visible" : "hidden" }}
          >
            <img src={left_arrow} alt="이전레벨" className="w-20" />
          </button>
          {renderModalContent()}
          <button
            onClick={goToNextModalLevel}
            style={{ visibility: currentModalLevel < maxLevel ? "visible" : "hidden" }}
          >
            <img src={right_arrow} alt="다음레벨" className="w-20" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelModal;
