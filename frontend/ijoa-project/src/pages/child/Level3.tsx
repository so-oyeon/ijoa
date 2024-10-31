import React, { useState } from "react";
import bglv3 from "/assets/child/bg-lv3.png";
import baby3 from "/assets/child/baby3.png";
import baby4 from "/assets/child/baby4.png";
import profile from "/assets/child/profile.png";
import info from "/assets/child/info-button.png";
import lock from "/assets/child/lock.png";
import left_arrow from "/assets/fairytales/buttons/left-arrow.png";
import right_arrow from "/assets/fairytales/buttons/right-arrow.png";
import closebutton from "/assets/close-button.png";
import "../../css/FairytaleContentPage.css";

const Level3: React.FC = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [currentModalLevel, setCurrentModalLevel] = useState(4);

  const goToPreviousModalLevel = () => {
    if (currentModalLevel > 4) {
      setCurrentModalLevel(currentModalLevel - 1);
    }
  };

  const goToNextModalLevel = () => {
    if (currentModalLevel < 4) {
      setCurrentModalLevel(currentModalLevel + 1);
    }
  };

  const renderModalContent = () => {
    const unlockText =
      currentModalLevel === 4 ? (
        <span>
          다음 단계로 가려면 <span className="text-purple-600 text-3xl font-bold">15권</span>을 더 읽으면 돼요!
        </span>
      ) : null;

    return (
      <div className="text-center">
        <div className="relative inline-block w-64 h-64">
          {" "}
          {/* 이미지 컨테이너 크기 증가 */}
          {currentModalLevel === 4 && (
            <img src={baby4} alt="LV4 이미지" className="w-full h-full filter brightness-50 object-contain" />
          )}
          <img
            src={lock}
            alt="잠금 아이콘"
            className="absolute"
            style={{
              width: "40%",
              height: "auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <p className="mt-4 font-semilbold text-2xl">{unlockText}</p>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img src={bglv3} alt="배경화면" className="w-full h-screen object-cover" />
      <img
        src={profile}
        alt="프로필이미지"
        className="absolute bottom-56 right-[calc(10%+60px)] transform -translate-x-1/2 w-[180px] z-10 rounded-3xl"
      />
      <img src={baby3} alt="애기1" className="absolute bottom-5 right-10 transform -translate-x-1/2 w-[320px]" />

      {/* 정보 버튼 */}
      <button
        onClick={() => setIsInfoVisible(true)}
        className="absolute bottom-[-12px] left-10 px-2 py-3 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md"
      >
        <span className="text-xs text-white">정보</span>
        <img src={info} alt="정보버튼" />
      </button>

      {/* 모달 화면 */}
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
                style={{ visibility: currentModalLevel !== 4 ? "visible" : "hidden" }}
              >
                <img src={left_arrow} alt="이전레벨" className="w-20 h-20" />
              </button>

              {renderModalContent()}

              <button
                onClick={goToNextModalLevel}
                style={{ visibility: currentModalLevel !== 4 ? "visible" : "hidden" }}
              >
                <img src={right_arrow} alt="다음레벨" className="w-20 h-20" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level3;
