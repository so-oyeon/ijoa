import React, { useState } from "react";
import ExitConfirmModal from "./ExitConfirmModal";
import PageSwiper from "../../components/fairytales/PageSwiper";
import CloseButton from "/assets/close-button.png";
import SoundButton from "/assets/fairytales/buttons/sound-button.png";
import MuteButton from "/assets/fairytales/buttons/sound-button-mute.png";
import ExitButton from "/assets/fairytales/buttons/exit-button.png";

interface FairytaleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  bookPages: string[];
  pageNums: string[];
  onPageClick: (index: number) => void;
  fairytaleCurrentPage: number;
  handleToggleTTS: (isSoundOn: boolean) => void;
  audioPlayRef: React.RefObject<HTMLAudioElement>;
  ttsId: number | null;
  previousTTSId: number | null;
}
const FairytaleMenu: React.FC<FairytaleMenuProps> = ({
  isOpen,
  onClose,
  bookPages,
  pageNums,
  onPageClick,
  fairytaleCurrentPage,
  handleToggleTTS,
  audioPlayRef,
  previousTTSId,
  ttsId,
}) => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);

  const toggleSound = () => {
    if (isSoundOn && audioPlayRef.current) {
      audioPlayRef.current.pause();
      audioPlayRef.current.currentTime = 0;
      handleToggleTTS(false);
    } else {
      handleToggleTTS(true);
    }
    setIsSoundOn((prev) => !prev);
  };

  const handleOpenExitConfirmModal = () => {
    setIsExitConfirmModalOpen(true);
  };

  const handleCloseExitConfirmModal = () => {
    setIsExitConfirmModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center h-screen z-50">
      {/* 창 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-10 right-16 text-white text-2xl">
        <img src={CloseButton} alt="닫기 버튼" className="w-12" />
      </button>

      {/* 제목 */}
      <h2 className="mt-10 mb-10 text-3xl font-semibold text-white">메뉴</h2>

      {/* 버튼 */}
      <div className="flex gap-36 mb-10">
        {(ttsId !== null || previousTTSId !== null) && (
          <button className="px-6 py-3 text-white rounded-lg" onClick={toggleSound}>
            <img
              src={isSoundOn ? SoundButton : MuteButton}
              alt={isSoundOn ? "소리 켜기 버튼" : "소리 끄기 버튼"}
              className="w-40"
            />
            <p className="mt-3 text-xl font-semibold">책 읽어주기</p>
          </button>
        )}

        <button className="px-6 py-3 text-white rounded-lg" onClick={handleOpenExitConfirmModal}>
          <img src={ExitButton} alt="나가기 버튼" className="w-40" />
          <p className="mt-3 text-xl font-semibold">나가기</p>
        </button>
      </div>
      <div className="w-full items-center justify-center">
        {/* 전체 페이지 스와이퍼 */}
        <div className="text-white ml-7">
          <PageSwiper
            bookPages={bookPages}
            pageNums={pageNums}
            onPageClick={onPageClick}
            activeIndex={fairytaleCurrentPage}
          />
        </div>
      </div>
      <ExitConfirmModal isOpen={isExitConfirmModalOpen} onClose={handleCloseExitConfirmModal} />
    </div>
  );
};

export default FairytaleMenu;
