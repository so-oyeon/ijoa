import React, { useState } from "react";
import ExitConfirmModal from "./ExitConfirmModal";
import PageSwiper from "./PageSwiper";
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center h-screen z-50 p-4">
      {/* 창 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 md:top-10 md:right-16 text-white text-2xl">
        <img src={CloseButton} alt="닫기 버튼" className="w-8 md:w-12" />
      </button>

      {/* 제목 */}
      <h2 className="mt-6 md:mt-10 mb-6 md:mb-10 text-2xl md:text-3xl font-semibold text-white">메뉴</h2>

      {/* 버튼 */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-36 mb-6 md:mb-10 items-center">
        {(ttsId !== null || previousTTSId !== null) && (
          <button className="px-4 md:px-6 py-2 md:py-3 text-white rounded-lg active:scale-110" onClick={toggleSound}>
            <img
              src={isSoundOn ? SoundButton : MuteButton}
              alt={isSoundOn ? "소리 켜기 버튼" : "소리 끄기 버튼"}
              className="w-24 md:w-40"
            />
            <p className="mt-2 md:mt-3 text-lg md:text-xl font-semibold">책 읽어주기</p>
          </button>
        )}

        <button className="px-4 md:px-6 py-2 md:py-3 text-white rounded-lg active:scale-110" onClick={handleOpenExitConfirmModal}>
          <img src={ExitButton} alt="나가기 버튼" className="w-24 md:w-40" />
          <p className="mt-2 md:mt-3 text-lg md:text-xl font-semibold">나가기</p>
        </button>
      </div>

      <div className="w-full items-center justify-center px-4">
        {/* 전체 페이지 스와이퍼 */}
        <div className="text-white ml-4 md:ml-7">
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
