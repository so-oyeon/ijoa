// src/components/tutorial/Tutorial.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { closeTutorial } from "../../redux/tutorialSlice";
import Portal from "../../components/tutorial/Portal";
import "../../css/Tutorial.css";
import closeButton from "/assets/close-button.png";

// 단계별 위치 스타일
const tutorialPositions: { [key: number]: React.CSSProperties } = {
  1: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // 첫 번째 단계: 화면 중앙
  },
  2: {
    top: "100px",
    right: "20px",
    left: "auto",
    transform: "none", // 두 번째 단계: 헤더 아래
  },
  3: {
    top: "100px",
    right: "200px",
    left: "auto",
    transform: "none", // 세 번째 단계: 헤더 아래 우측
  },
  4: {
    top: "100px",
    right: "120px",
    left: "auto",
    transform: "none", // 세 번째 단계: 헤더 아래 우측
  },
  // 추가 단계가 필요한 경우 여기에 추가
};

// 강조할 영역 위치
const highlightPositions: { [key: number]: React.CSSProperties } = {
  2: {
    top: "5px",
    right: "20px",
    width: "28%",
    height: "90px", // 두 번째 단계에서 헤더 부분 강조
  },
  3: {
    top: "5px",
    right: "21%",
    width: "5%",
    height: "90px", // 세 번째 단계에서 특정 헤더 영역 강조
  },
  4: {
    top: "5px",
    right: "16%",
    width: "5%",
    height: "90px", // 세 번째 단계에서 특정 헤더 영역 강조
  },
  // 추가 단계가 필요한 경우 여기에 추가
};

const Tutorial: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.tutorial.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);

  const close = () => dispatch(closeTutorial());
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="font-['MapleLight']">
            <h2 className="text-2xl font-bold mb-2 blue-highlight">튜토리얼 안내</h2>
            <p>아이조아에 오신 것을 환영해요! <br /> 기본 사용법을 안내합니다.</p>
            <button onClick={nextStep} className="tutorial-btn tutorial-next-btn mt-4">다음</button>
          </div>
        );
      case 2:
        return (
          <div className="font-['MapleLight']">
            <h2 className="text-2xl font-bold mb-2 blue-highlight">헤더 기능 안내</h2>
            <p>주요 기능에 접근할 수 있습니다.</p>
            <div className="flex justify-between">
              <button onClick={prevStep} className="tutorial-btn tutorial-prev-btn mt-4">이전</button>
              <button onClick={nextStep} className="tutorial-btn tutorial-next-btn mt-4">다음</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="font-['MapleLight']">
            <h2 className="text-2xl font-bold mb-2 blue-highlight">자녀</h2>
            <p>자녀를 선택해서 책 읽기를 시작하세요!</p>
            <div className="flex justify-between">
              <button onClick={prevStep} className="tutorial-btn tutorial-prev-btn mt-4">이전</button>
              <button onClick={nextStep} className="tutorial-btn tutorial-next-btn mt-4">다음</button>
            </div>
          </div>
        );
      case 4:
        return(
        <div className="font-['MapleLight']">
          <h2 className="text-2xl font-bold mb-2 blue-highlight">TTS</h2>
          <p>자녀에게 들려주고 싶은 <br />목소리를 녹음하세요!</p>
          <div className="flex justify-between">
            <button onClick={prevStep} className="tutorial-btn tutorial-prev-btn mt-4">이전</button>
            <button onClick={nextStep} className="tutorial-btn tutorial-next-btn mt-4">다음</button>
          </div>
        </div>

        );
        
      default:
        return null;
    }
  };

  return (
    isOpen && (
      <Portal>
        {/* 클릭 방지 오버레이 */}
        <div className="overlay-click-prevent"></div>

        {/* 단계별 강조 오버레이 */}
        {highlightPositions[step] && (
          <>
            {/* 전체 화면을 어둡게 처리하는 오버레이 */}
            <div className="overlay-dark"></div>

            {/* 강조할 영역을 밝게 처리 */}
            <div className="overlay-highlight" style={highlightPositions[step]}></div>
          </>
        )}

        {/* 튜토리얼 모달 */}
        <div className="tutorial-modal" style={tutorialPositions[step]}>
          <button onClick={close} className="tutorial-close-btn">
            <img src={closeButton} alt="Close" />
          </button>
          {renderContent()}
        </div>
      </Portal>
    )
  );
};

export default Tutorial;
