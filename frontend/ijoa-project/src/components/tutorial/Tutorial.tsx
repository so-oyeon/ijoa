import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { closeTutorial, setStep } from "../../redux/tutorialSlice";
import Portal from "../../components/tutorial/Portal";
import { userApi } from "../../api/userApi";
import "../../css/Tutorial.css";
import closeButton from "/assets/close-button.png";

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TutorialProps {
  menuPositions: Position[];
}

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

const Tutorial: React.FC<TutorialProps> = ({ menuPositions }) => {
  const isOpen = useSelector((state: RootState) => state.tutorial.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  const step = useSelector((state: RootState) => state.tutorial.step);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [modalPosition, setModalPosition] = useState<React.CSSProperties>({
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  useEffect(() => {
    if (menuPositions && menuPositions.length === 5) {
      let newHighlightStyle = {};
      switch (step) {
        case 1:
          newHighlightStyle = { top: "50%", left: "50%", width: "0%", height: "0%" };
          break;
        case 2: {
          const leftMost = menuPositions[0].left;
          const rightMost = menuPositions[4].left + menuPositions[4].width;
          newHighlightStyle = {
            top: menuPositions[0].top,
            left: leftMost,
            width: rightMost - leftMost,
            height: menuPositions[0].height,
          };
          break;
        }
        case 3:
          newHighlightStyle = {
            top: menuPositions[0].top,
            left: menuPositions[0].left,
            width: menuPositions[0].width,
            height: menuPositions[0].height,
          };
          break;
        case 4:
          newHighlightStyle = {
            top: menuPositions[1].top,
            left: menuPositions[1].left,
            width: menuPositions[1].width,
            height: menuPositions[1].height,
          };
          break;
        case 5:
          newHighlightStyle = {
            top: menuPositions[2].top,
            left: menuPositions[2].left,
            width: menuPositions[2].width,
            height: menuPositions[2].height,
          };
          break;
        case 6:
          newHighlightStyle = {
            top: menuPositions[3].top,
            left: menuPositions[3].left,
            width: menuPositions[3].width,
            height: menuPositions[3].height,
          };
          break;
        case 7:
          newHighlightStyle = {
            top: "210px",
            left: "630px",
            width: "12%",
            height: "170px",
          };
          break;
        case 8:
          newHighlightStyle = {
            top: menuPositions[0].top,
            left: menuPositions[0].left - 15,
            width: menuPositions[0].width,
            height: menuPositions[0].height,
          };
          break;
        case 9:
          newHighlightStyle = {
            top: menuPositions[1].top,
            left: menuPositions[1].left - 15,
            width: menuPositions[1].width,
            height: menuPositions[1].height,
          };
          break;
        case 10:
          newHighlightStyle = {
            top: menuPositions[2].top,
            left: menuPositions[2].left - 15,
            width: menuPositions[2].width,
            height: menuPositions[2].height,
          };
          break;
        case 11:
          newHighlightStyle = {
            top: menuPositions[3].top,
            left: menuPositions[3].left - 15,
            width: menuPositions[3].width,
            height: menuPositions[3].height,
          };
          break;
        case 12:
          newHighlightStyle = {
            top: menuPositions[4].top,
            left: menuPositions[4].left - 15,
            width: menuPositions[4].width,
            height: menuPositions[4].height,
          };
          break;
        case 13:
          newHighlightStyle = { top: "50%", left: "50%", width: "0%", height: "0%" };
          break;
        default:
          newHighlightStyle = {};
          break;
      }
      // 강조 효과를 조정
      setHighlightStyle({
        ...newHighlightStyle,
      });
    }
  }, [step, menuPositions]);

  // 단계별로 모달 위치 설정
  useEffect(() => {
    let newPosition: React.CSSProperties = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    switch (step) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        newPosition = { top: "100px", right: "40px", left: "auto", transform: "none" };
        break;
      case 7:
        newPosition = { top: "45%", left: "30%", transform: "translate(-50%, -50%)" };
        break;
      case 13:
        newPosition = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
        break;
      default:
        break;
    }
    setModalPosition(newPosition);
  }, [step]);

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

        {/* 단계별 위치 강조 영역 */}
        <div className="overlay-highlight" style={highlightStyle}></div>

        {/* 튜토리얼 모달 */}
        <div className="tutorial-modal" style={modalPosition}>
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
