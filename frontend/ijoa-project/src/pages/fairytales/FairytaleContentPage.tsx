import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../css/FairytaleContentPage.css"
import ReadCompleteModal from "../../components/fairytales/ReadCompleteModal";
import LevelUpModal from "../../components/fairytales/LevelUpModal";
import TTSChoiceModal from "../../components/fairytales/TTSChoiceModal";
import QuizModal from "../../components/fairytales/QuizModal";
import FocusAlertModal from "../../components/fairytales/FocusAlertModal";
import FairytaleMenu from "../../components/fairytales/FairytaleMenu";
import MenuButton from "/assets/fairytales/buttons/menu-button.png";
import SoundOnButton from "/assets/fairytales/buttons/sound-on-button.png";
import LeftArrow from "/assets/fairytales/buttons/left-arrow.png";
import RightArrow from "/assets/fairytales/buttons/right-arrow.png";
import dummy1 from "/assets/fairytales/images/dummy1.png";
import dummy2 from "/assets/fairytales/images/dummy2.png";
import dummy3 from "/assets/fairytales/images/dummy3.png";
import dummy4 from "/assets/fairytales/images/dummy4.png";
import dummy5 from "/assets/fairytales/images/dummy5.png";
import dummy6 from "/assets/fairytales/images/dummy6.png";
import dummy7 from "/assets/fairytales/images/dummy7.png";
import dummy8 from "/assets/fairytales/images/dummy8.png";
import dummy9 from "/assets/fairytales/images/dummy9.png";
import dummy10 from "/assets/fairytales/images/dummy10.png";

// 더미 데이터
const fairyTales = [
  {
    image: dummy1,
    text: "거북아~ 나랑 달리기 내기 하지 않을래?",
  },
  {
    image: dummy2,
    text: "준비~ 땅! 토끼는 시작과 함께 깡총~깡총 빠르게 뛰어갔어요.",
  },
  {
    image: dummy3,
    text: "어휴~ 지겨워! 거북이가 오려면 아직 멀었겠다. 여기서 낮잠이나 한숨 자야지.",
  },
  {
    image: dummy4,
    text: "토끼가 낮잠을 자는 사이, 거북이는 느리지만 열심히 기어갔어요.",
  },
  {
    image: dummy5,
    text: "잠에서 깬 토끼는 어느새 결승선에 먼저 도착한 거북이를 보고 깜짝! 놀랐어요.",
  },
  {
    image: dummy6,
    text: "동물 친구들은 내기에서 이긴 거북이를 축하해주며 함께 기뻐했어요.",
  },
  {
    image: dummy7,
    text: "거북아~ 정말 대단해! 사실 네가 이길 줄은 몰랐어.",
  },
  {
    image: dummy8,
    text: "헤헤... 아니야~ 난 그저 열심히 기어갔을 뿐인걸?",
  },
  {
    image: dummy9,
    text: "거북이 네가 어떻게 나보다 빨리 도착할 수가 있어? 이 내기는 무효야!",
  },
  {
    image: dummy10,
    text: "헤헤 토끼야, 그럼 바다에서 한 번 더 달리기 내기할까?",
  },
];

const FairyTaleContentPage: React.FC = () => {
  const location = useLocation();
  const { title } = location.state || { title: "제목 없음" };
  const [fairytaleCurrentPage, setFairytaleCurrentPage] = useState(0);
  const [isTTSChoiceModalOpen, setIsTTSChoiceModalOpen] = useState(true);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isReadCompleteModalOpen, setIsReadCompleteModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocusAlertModalOpen, setIsFocusAlertModalOpen] = useState(false);

  // 메뉴창 Swiper를 위한 props 설정
  const bookPages = fairyTales.map((fairyTale) => fairyTale.image);
  const pageNums = fairyTales.map((_, index) => `${index + 1} 페이지`);
  const halfwayPage = Math.floor(fairyTales.length / 2);

  // 왼쪽 화살표 클릭 시 현재 페이지를 감소시키는 함수
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      setFairytaleCurrentPage(fairytaleCurrentPage - 1);
    }
  };

  // 오른쪽 화살표 클릭 시 현재 페이지를 증가시키는 함수
  const handleRightClick = () => {
    if (fairytaleCurrentPage < fairyTales.length - 1) {
      const newPage = fairytaleCurrentPage + 1;
      setFairytaleCurrentPage(newPage);
      if (newPage === halfwayPage) {
        setIsFocusAlertModalOpen(true);
      }
    } else {
      setIsLevelUpModalOpen(true);
    }
  };

  // TTS 선택 모달 닫기 함수
  const handleCloseTTSChoiceModal = () => {
    setIsTTSChoiceModalOpen(false);
  };

  // 퀴즈 모달 열기 함수
  const handleOpenQuizModal = () => {
    setIsQuizModalOpen(true);
  };

  // 퀴즈 모달 닫기 함수
  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
  };

  // 메뉴창 열기 함수
  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  // 메뉴창 닫기 함수
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // 집중 알림 모달 닫기 함수
  const handleCloseFocusAlertModal = () => {
    setIsFocusAlertModalOpen(false);
  };

  // 메뉴창에서 페이지 선택 함수
  const handlePageClick = (index: number) => {
    setFairytaleCurrentPage(index - 1);
    setIsMenuOpen(false);
  };

  // 레벨업 모달이 열릴 때 일정 시간 후에 독서 완료 모달 열기
  useEffect(() => {
    if (isLevelUpModalOpen) {
      const timer = setTimeout(() => {
        setIsLevelUpModalOpen(false);
        setIsReadCompleteModalOpen(true); // 레벨업 모달 닫고 독서 완료 모달 열기
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLevelUpModalOpen]);

  return (
    <div className="relative h-screen">
      <img src={fairyTales[fairytaleCurrentPage].image} alt="동화책 내용 사진" className="w-screen h-screen" />
      {/* 메뉴 버튼 */}
      <div className="absolute top-[-12px] right-10">
        <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md" onClick={handleOpenMenu}>
          <img src={MenuButton} alt="메뉴 버튼" />
          <p className="text-xs text-white">메뉴</p>
        </button>
      </div>

      {/* 임시 버튼 - 퀴즈 화면 조회용 */}
      <div className="absolute top-[-12px] right-[150px]">
        <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md" onClick={handleOpenQuizModal}>
          <img src={MenuButton} alt="퀴즈 버튼" />
          <p className="text-xs text-white">퀴즈</p>
        </button>
      </div>

      <div className="w-3/4 h-[140px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-3xl shadow-lg">
        <button className="items-center ml-5">
          <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-20 h-20" />
          <p className="text-sm text-[#565656] font-bold">다시 듣기</p>
        </button>
        <p className=" max-w-full px-12 flex-1 text-3xl font-bold text-center fairytale-font whitespace-pre-line break-keep">
          {fairyTales[fairytaleCurrentPage].text}
        </p>
      </div>

      {fairytaleCurrentPage > 0 && (
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
          <button className="bg-transparent border-none" onClick={handleLeftClick}>
            <img src={LeftArrow} alt="왼쪽 화살표" />
          </button>
        </div>
      )}

      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <button className="bg-transparent border-none" onClick={handleRightClick}>
          <img src={RightArrow} alt="오른쪽 화살표" />
        </button>
      </div>

      {/* TTS 선택 모달 */}
      {/* Fix: hasRead => 처음 읽는건지 읽었던 건지 구분 */}
      <TTSChoiceModal isOpen={isTTSChoiceModalOpen} onClose={handleCloseTTSChoiceModal} hasRead={false} />
      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} title={title} />
      {/* 퀴즈 모달 */}
      <QuizModal isOpen={isQuizModalOpen} onClose={handleCloseQuizModal} />
      {/* 메뉴창 */}
      <FairytaleMenu
        fairytaleCurrentPage={fairytaleCurrentPage}
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        bookPages={bookPages}
        pageNums={pageNums}
        onPageClick={handlePageClick}
      />
      {/* 집중 알람 모달 */}
      <FocusAlertModal isOpen={isFocusAlertModalOpen} onClose={handleCloseFocusAlertModal} />
    </div>
  );
};

export default FairyTaleContentPage;
