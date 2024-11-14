import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { closeTutorial, setStep } from "../../redux/tutorialSlice";
import Portal from "../../components/tutorial/Portal";
import { userApi } from "../../api/userApi";
import "../../css/Tutorial.css";
import closeButton from "/assets/close-button.png";

// 단계별 콘텐츠
const stepContents = {
  1: { title: "튜토리얼 안내", text: "아이조아에 오신 것을 환영해요!" },
  2: { title: "헤더 기능 안내", text: "주요 기능에 접근할 수 있습니다." },
  3: { title: "자녀", text: "등록한 자녀 목록을 확인하고\n계정을 선택할 수 있어요!" },
  4: { title: "TTS", text: "자녀에게 들려주고 싶은\n목소리를 등록해 보세요!" },
  5: { title: "통계", text: "자녀의 독서 습관을 확인해 보세요!" },
  6: { title: "음성앨범", text: "퀴즈에 대한 자녀의 답변을 들어볼 수 있어요!" },
  7: { title: "자녀", text: "자녀를 등록하면 책 읽기를 시작할 수 있어요!\n지금 바로 등록하러 가볼까요?" },
  8: { title: "도서관", text: "전체 동화책 목록을 확인하고 제목으로 검색할 수 있어요!" },
  9: { title: "내 책장", text: "내가 읽은 책과 읽고 있는 책을 볼 수 있어요!" },
  10: { title: "내 방", text: "내 캐릭터의 레벨과 모습을 볼 수 있어요!" },
  11: { title: "설정", text: "책 읽어주기, 퀴즈, bgm을 껏다 켰다 할 수 있어요!" },
  12: { title: "프로필", text: "부모 계정으로 전환, 로그아웃이 가능해요!" },
  13: { title: "튜토리얼 끝", text: "이제 아이조아와 함께해요!" },
};

const Tutorial: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.tutorial.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  const step = useSelector((state: RootState) => state.tutorial.step);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 튜토리얼 완료 함수 api
  const completeTutorial = async () => {
    try {
      const response = await userApi.completeTutorial();
      if (response.status === 200) {
        dispatch(closeTutorial());
      }
    } catch (error) {
      console.log("completeTutorial 오류: ", error);
    }
  };

  const nextStep = () => {
    if (step === 7) {
      // 튜토리얼을 일시적으로 닫기
      dispatch(closeTutorial());
    } else {
      dispatch(setStep(step + 1));
    }
  };
  const prevStep = () => dispatch(setStep(step - 1));

  const closeTutorialModal = () => {
    setShowConfirmModal(false); // 확인 모달 닫기
  };

  const confirmCloseTutorial = () => {
    completeTutorial(); // 튜토리얼 완료 처리
    setShowConfirmModal(false); // 확인 모달 닫기
  };

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
            <TutorialButton onClick={completeTutorial} label="완료" />
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
        <div className="overlay-dark"></div>
        <div className={`overlay-highlight highlight-position-${step}`}></div>

        {/* 튜토리얼 모달 */}
        <div className={`tutorial-modal tutorial-position-${step}`}>
          <button onClick={() => setShowConfirmModal(true)} className="tutorial-close-btn">
            <img src={closeButton} alt="Close" />
          </button>
          {renderContent()}
        </div>

        {/* 확인 모달 */}
        {showConfirmModal && (
          <div className="confirm-modal font-['MapleLight']">
            <div className="confirm-modal-content">
              <p className="text-2xl font-bold white red-highlight">튜토리얼을 다시는 볼 수 없습니다. </p>
              <p className="text-xl white mt-4">그래도 종료하시겠습니까?</p>
              <div className="confirm-modal-buttons">
                <button onClick={confirmCloseTutorial} className="confirm-btn">
                  예
                </button>
                <button onClick={closeTutorialModal} className="cancel-btn">
                  아니오
                </button>
              </div>
            </div>
          </div>
        )}
      </Portal>
    )
  );
};

export default Tutorial;
