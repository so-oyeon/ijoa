import React, { useState } from "react";
import bglv1 from "/assets/child/bg-lv1.png";
import baby1 from "/assets/child/baby1.png";
import baby2 from "/assets/child/baby2.png";
import baby3 from "/assets/child/baby3.png";
import baby4 from "/assets/child/baby4.png";
import profile from "/assets/child/profile.png";
import info from "/assets/child/info-button.png";
import lock from "/assets/child/lock.png";
import left_arrow from "/assets/fairytales/buttons/left-arrow.png";
import right_arrow from "/assets/fairytales/buttons/right-arrow.png";
import closebutton from "/assets/close-button.png";
import "../../css/FairytaleContentPage.css";

const Level1: React.FC = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [currentModalLevel, setCurrentModalLevel] = useState(2);

  const goToPreviousModalLevel = () => {
    if (currentModalLevel > 2) {
      setCurrentModalLevel(currentModalLevel - 1);
    }
  };

  const goToNextModalLevel = () => {
    if (currentModalLevel < 4) {
      setCurrentModalLevel(currentModalLevel + 1);
    }
  };

  const renderModalContent = () => {
    const babyImage = currentModalLevel === 2 ? baby2 : currentModalLevel === 3 ? baby3 : baby4;

    const unlockText =
      currentModalLevel === 2 ? (
        <span>
          다음 단계로 가려면 <span className="text-purple-600 text-3xl font-bold">5권</span>을 더 읽으면 돼요!
        </span>
      ) : currentModalLevel === 3 ? (
        <span>
          다음 단계로 가려면 <span className="text-purple-600 text-3xl font-bold">10권</span>을 더 읽으면 돼요!
        </span>
      ) : (
        <span>
          다음 단계로 가려면 <span className="text-purple-600 text-3xl font-bold">15권</span>을 더 읽으면 돼요!
        </span>
      );

    return (
      <div className="text-center">
        <div className="relative inline-block w-64 h-64">
          {" "}
          {/* 이미지 컨테이너 크기 증가 */}
          <img
            src={babyImage}
            alt={`LV${currentModalLevel} 이미지`}
            className="w-full h-full filter brightness-50 object-contain"
          />
          <img
            src={lock}
            alt="잠금 아이콘"
            className="absolute w-2/5 h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <p className="mt-4 font-semilbold text-2xl">{unlockText}</p>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img src={bglv1} alt="배경화면" className="w-full h-screen object-cover" />
      <img
        src={profile}
        alt="프로필이미지"
        className="absolute bottom-40 left-[calc(50%+12px)] transform -translate-x-1/2 w-[160px] z-10 rounded-3xl"
      />
      <img src={baby1} alt="애기1" className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-1/6" />

      {/* 정보 버튼 */}
      <button
        onClick={() => setIsInfoVisible(true)}
        className="absolute bottom-[-12px] left-10 px-2 py-3 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md"
      >
        <span className="text-xs text-white">정보</span>
        <img src={info} alt="정보버튼" />
      </button>

      {/* 모달 */}
      {isInfoVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          {/* 모달 크기 조정 */}
          <div className="relative bg-[#FCFFEA] p-10 rounded-lg shadow-lg w-3/4 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold mb-10 blue-highlight">단계 정보</h2>

            {/* 닫기 버튼이 모달 내부 오른쪽 상단에 위치하도록 설정 */}
            <button onClick={() => setIsInfoVisible(false)} className="absolute top-4 right-4">
              <img src={closebutton} alt="Close" />
            </button>

            {/* 좌우 이동 버튼과 현재 레벨에 따른 콘텐츠 */}
            <div className="flex items-center justify-center gap-x-8 mb-6">
              <button
                onClick={goToPreviousModalLevel}
                className={`${currentModalLevel !== 2 ? "visible" : "invisible"} w-20 h-20`}
              >
                <img src={left_arrow} alt="이전레벨" className="w-full h-full" />
              </button>
              {renderModalContent()}
              <button
                onClick={goToNextModalLevel}
                className={`${currentModalLevel !== 4 ? "visible" : "invisible"} w-20 h-20`}
              >
                <img src={right_arrow} alt="다음레벨" className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level1;
