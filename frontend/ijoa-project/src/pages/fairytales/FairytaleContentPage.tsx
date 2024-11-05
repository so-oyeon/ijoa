import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../../css/FairytaleContentPage.css";
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
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleContentResponse, FairyTalePageResponse, QuizQuestionResponse } from "../../types/fairytaleTypes";

const FairyTaleContentPage: React.FC = () => {
  const { fairytaleId } = useParams<{ fairytaleId: string }>();
  const location = useLocation();
  const title = location.state?.title;
  const [fairytaleCurrentPage, setFairytaleCurrentPage] = useState(0);
  const [fairytaleData, setFairytaleData] = useState<FairyTaleContentResponse>();
  const [quizData, setQuizData] = useState<QuizQuestionResponse>();
  const [bookPages, setBookPages] = useState<string[]>([]);
  const [pageNums, setPageNums] = useState<string[]>([]);
  const [isTTSChoiceModalOpen, setIsTTSChoiceModalOpen] = useState(true);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isReadCompleteModalOpen, setIsReadCompleteModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocusAlertModalOpen, setIsFocusAlertModalOpen] = useState(false);

  // 동화책 내용(이미지, 텍스트)을 가져오는 api 통신 함수
  const getFairyTaleContent = useCallback(
    async (page: number) => {
      if (!fairytaleId) {
        console.error("Fairytale ID is undefined");
        return;
      }
      try {
        const response = await fairyTaleApi.getFairyTaleContents(fairytaleId, String(page + 1));
        if (response.status === 201) {
          setFairytaleData(response.data);
        }
      } catch (error) {
        console.log("fairyTaleApi의 getFairyTaleContents : ", error);
      }
    },
    [fairytaleId]
  );

  // 동화책 전체 페이지를 가져오는 api 통신 함수
  const getFairyTalePages = async () => {
    if (!fairytaleId) {
      console.error("Fairytale ID is undefined");
      return;
    }
    try {
      const response = await fairyTaleApi.getFairyTalePages(fairytaleId);
      if (response.status === 200 && Array.isArray(response.data)) {
        const images = response.data.map((page: FairyTalePageResponse) => page.image);
        setBookPages(images);
        setPageNums(images.map((_, index) => `${index + 1} 페이지`));
      }
    } catch (error) {
      console.error("fairyTaleApi의 getFairyTalePages :", error);
    }
  };

  // 동화책 퀴즈 가져오는 api 통신 함수
  const getQuizData = useCallback(async () => {
    try {
      const response = await fairyTaleApi.getQuizQuestion(fairytaleCurrentPage);
      if (response.status === 200) {
        setQuizData(response.data);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }, [fairytaleCurrentPage]);

  // 왼쪽 화살표 클릭 시 현재 페이지를 감소시키는 함수
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      const newPage = fairytaleCurrentPage - 1;
      setFairytaleCurrentPage(newPage);
      getFairyTaleContent(newPage); // 새로운 페이지 요청
    }
  };

  // 오른쪽 화살표 클릭 시 현재 페이지를 증가시키는 함수
  const handleRightClick = () => {
    if (fairytaleData) {
      const isLastPage = fairytaleCurrentPage === fairytaleData.totalPages - 1;

      if (isLastPage) {
        setIsLevelUpModalOpen(true);
      } else if (fairytaleCurrentPage < fairytaleData.totalPages - 1) {
        const newPage = fairytaleCurrentPage + 1;
        setFairytaleCurrentPage(newPage);
        getFairyTaleContent(newPage);

        if ((newPage + 1) % 5 === 0) {
          setIsQuizModalOpen(true);
          getQuizData();
        } else if (newPage === Math.floor(fairytaleData.totalPages / 2)) {
          setIsFocusAlertModalOpen(true);
        }
      }
    }
  };

  // TTS 선택 모달 닫기 함수
  const handleCloseTTSChoiceModal = () => {
    setIsTTSChoiceModalOpen(false);
  };

  // 퀴즈 모달 닫기 함수
  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
  };

  // 메뉴창 열기 함수
  const handleOpenMenu = () => {
    getFairyTalePages();
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

  useEffect(() => {
    getFairyTaleContent(fairytaleCurrentPage);
  }, [fairytaleCurrentPage, getFairyTaleContent]); // fairytaleCurrentPage가 변경될 때만 호출

  return (
    <div className="relative h-screen">
      {fairytaleData ? (
        <>
          <img src={fairytaleData.image} alt="동화책 내용 사진" className="w-screen h-screen object-cover" />
          <div className="w-[1100px] h-[160px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-2xl shadow-lg">
            <button className="items-center ml-5">
              <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-20 h-20" />
              <p className="text-sm text-[#565656] font-bold">다시 듣기</p>
            </button>
            <div className="px-12 flex-1 text-3xl font-bold text-center fairytale-font whitespace-pre-line break-keep">
              <p className="px-12 flex-1 text-3xl font-bold text-center fairytale-font whitespace-pre-line break-keep">
                {fairytaleData.content}
              </p>
            </div>
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

          {/* 메뉴 버튼 */}
          <div className="absolute top-[-12px] right-10">
            <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md" onClick={handleOpenMenu}>
              <img src={MenuButton} alt="메뉴 버튼" />
              <p className="text-xs text-white">메뉴</p>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">Loading...</p>
        </div>
      )}

      {/* TTS 선택 모달 */}
      {/* Fix: hasRead => 처음 읽는건지 읽었던 건지 구분 */}
      <TTSChoiceModal isOpen={isTTSChoiceModalOpen} onClose={handleCloseTTSChoiceModal} hasRead={false} />
      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} title={title} />
      {/* 퀴즈 모달 */}
      <QuizModal isOpen={isQuizModalOpen} onClose={handleCloseQuizModal} quizData={quizData?.text} />
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
