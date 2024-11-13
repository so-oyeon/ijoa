import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { closeTutorial, setStep } from "../../redux/tutorialSlice";
import Portal from "../../components/tutorial/Portal";
import "../../css/Tutorial.css";
import closeButton from "/assets/close-button.png";

// 단계별 위치 스타일
const tutorialPositions: { [key: number]: React.CSSProperties } = {
  1: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  2: { top: "100px", right: "20px", left: "auto", transform: "none" },
  3: { top: "100px", right: "200px", left: "auto", transform: "none" },
  4: { top: "100px", right: "120px", left: "auto", transform: "none" },
  5: { top: "100px", right: "90px", left: "auto", transform: "none" },
  6: { top: "100px", right: "60px", left: "auto", transform: "none" },
  7: { top: "210px", left: "270px", right: "auto", transform: "none" },
  8: { top: "100px", right: "200px", left: "auto", transform: "none" },
  9: { top: "100px", right: "120px", left: "auto", transform: "none" },
  10: { top: "100px", right: "90px", left: "auto", transform: "none" },
  11: { top: "100px", right: "60px", left: "auto", transform: "none" },
  12: { top: "100px", right: "28px", left: "auto", transform: "none" },
  13: { top: "100px", left: "20px", right: "auto", transform: "none" },
};

// 강조할 영역 위치
const highlightPositions: { [key: number]: React.CSSProperties } = {
  1: { top: "50%", width: "0%", height: "0%" },
  2: { top: "5px", right: "20px", width: "28%", height: "90px" },
  3: { top: "5px", right: "21%", width: "5%", height: "90px" },
  4: { top: "5px", right: "16%", width: "5%", height: "90px" },
  5: { top: "5px", right: "12%", width: "5%", height: "90px" },
  6: { top: "5px", right: "7%", width: "5%", height: "90px" },
  7: { top: "210px", left: "44%", width: "12%", height: "170px" },
  8: { top: "5px", right: "21%", width: "5%", height: "90px" },
  9: { top: "5px", right: "16%", width: "5%", height: "90px" },
  10: { top: "5px", right: "12%", width: "5%", height: "90px" },
  11: { top: "5px", right: "7%", width: "5%", height: "90px" },
  12: { top: "5px", right: "2%", width: "5%", height: "90px" },
  13: { top: "5px", left: "20px", width: "20%", height: "90px" },
} as const;

// 단계별 콘텐츠
const stepContents = {
  1: { title: "튜토리얼 안내", text: "아이조아에 오신 것을 환영해요!" },
  2: { title: "헤더 기능 안내", text: "주요 기능에 접근할 수 있습니다." },
  3: { title: "자녀", text: "등록한 자녀들을 확인하고 선택할 수 있어요!" },
  4: { title: "TTS", text: "자녀에게 들려주고 싶은 목소리를 녹음하세요!" },
  5: { title: "통계", text: "자녀 독서 습관을 알아보아요!" },
  6: { title: "음성앨범", text: "자녀의 대답을 들어볼 수 있어요!" },
  7: { title: "자녀", text: "등록한 자녀들을 확인하고 선택할 수 있어요!\n지금 바로 등록하러 가볼까요?" },
  8: { title: "도서관", text: "자녀에게 들려주고 싶은 목소리를 녹음하세요!" },
  9: { title: "내 책장", text: "내가 읽은 책과 읽고 있는 책을 볼 수 있어요!" },
  10: { title: "내 방", text: "내 캐릭터의 레벨과 모습을 볼 수 있어요!" },
  11: { title: "설정", text: "읽어주기, 퀴즈, bgm을 껏다 켰다 할 수 있어요!" },
  12: { title: "프로필", text: "부모로 전환, 로그아웃이 가능해요!" },
  13: { title: "튜토리얼 끝", text: "이제부터 아이조아와 함께 해볼까요?" },
};

const Tutorial: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.tutorial.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  const step = useSelector((state: RootState) => state.tutorial.step);

  const close = () => dispatch(closeTutorial());
  const nextStep = () => {
    if (step === 7) {
      // 튜토리얼을 일시적으로 닫기
      dispatch(closeTutorial());
    } else {
      dispatch(setStep(step + 1));
    }
  };
  const prevStep = () => dispatch(setStep(step - 1));

  // 공통 버튼 컴포넌트
  const TutorialButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      className={`tutorial-btn ${
        label === "완료" ? "tutorial-complete-btn" : label === "이전" ? "tutorial-prev-btn" : "tutorial-next-btn"
      } mt-4`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    const { title, text } = stepContents[step as keyof typeof stepContents];
    
    return (
      <div className="font-['MapleLight']">
        <h2 className="text-2xl font-bold mb-2 blue-highlight">{title}</h2>
        <p className="whitespace-pre-line">{text}</p>
        <div className={`flex ${step === 1 || step === 8 ? "justify-center" : "justify-between"} mt-4`}>
          {step > 1 && step !== 8 && <TutorialButton onClick={prevStep} label="이전" />}
  
          {/* 7단계일 경우에만 "등록" 버튼 표시 */}
          {step === 7 ? (
            <TutorialButton onClick={nextStep} label="등록" />
          ) : step < 13 ? (
            <TutorialButton onClick={nextStep} label="다음" />
          ) : (
            <TutorialButton onClick={close} label="완료" />
          )}
        </div>
      </div>
    );
  };

  return (
    isOpen && (
      <Portal>
        {/* 클릭 방지 오버레이 */}
        <div className="overlay-click-prevent"></div>

        {/* 단계별 강조 오버레이 */}
        {highlightPositions[step] && (
          <>
            <div className="overlay-dark"></div>
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
