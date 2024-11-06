import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const isCompleted = location.state?.isCompleted;
  const currentPage = location.state?.currentPage;
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
  const [isQuizDataLoading, setIsQuizDataLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioPlayRef = useRef<HTMLAudioElement | null>(null);

  const bookId = fairytaleId ? parseInt(fairytaleId, 10) : 0;
  const isReading = !isCompleted && currentPage > 0;

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

  // TTS 낭독 api
  const getTTSPlayback = async () => {
    try {
      // localStorage에서 TTS ID를 가져옴
      const ttsId = localStorage.getItem("selectedTtsId");

      // ttsId가 null이 아니고, 숫자로 변환할 수 있는지 확인
      if (ttsId) {
        const parsedTtsId = parseInt(ttsId, 10);

        // ttsId가 유효한 숫자인지 확인
        if (!isNaN(parsedTtsId)) {
          const page = fairytaleCurrentPage + 1;

          // API 호출
          const response = await fairyTaleApi.getTTSPlayback(parsedTtsId, bookId, page);

          if (response.status === 200 && response.data?.url) {
            const audioUrl = response.data.url;
            setAudioURL(audioUrl);

            setTimeout(() => {
              audioPlayRef.current?.play();
            }, 100);
          }
        } else {
          console.error("유효하지 않은 ttsId :", ttsId);
        }
      } else {
        console.log("로컬 스토리지에 ttsId가 없음");
      }
    } catch (error) {
      console.error("fairyTaleApi의 getTTSPlayback :", error);
    }
  };

  const handlePlayRecordingAudio = () => {
    getTTSPlayback();
  };

  // 퀴즈 데이터 로딩 함수에서 로딩 상태 관리
  const getQuizData = useCallback(
    async (quizPageNumber: number) => {
      setIsQuizDataLoading(true); // 로딩 시작
      try {
        const response = await fairyTaleApi.getQuizQuestion(bookId, quizPageNumber);
        if (response.status === 200) {
          setQuizData(response.data);
        }
      } catch (error) {
        console.error("fairyTaleApi의 getQuizQuestion :", error);
      } finally {
        setIsQuizDataLoading(false); // 로딩 종료
      }
    },
    [bookId]
  );

  // 왼쪽 화살표 클릭 시 현재 페이지를 감소시키는 함수
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      const newPage = fairytaleCurrentPage - 1;
      setFairytaleCurrentPage(newPage);
      getFairyTaleContent(newPage); // 새로운 페이지 요청
    }
  };

  // 오른쪽 화살표 클릭 함수에서 퀴즈 모달을 열기 전에 로딩 상태를 확인
  const handleRightClick = () => {
    if (fairytaleData) {
      const isLastPage = fairytaleCurrentPage === fairytaleData.totalPages - 1;

      if (isLastPage) {
        setIsLevelUpModalOpen(true);
      } else if (fairytaleCurrentPage < fairytaleData.totalPages - 1) {
        const newPage = fairytaleCurrentPage + 1;
        setFairytaleCurrentPage(newPage);
        getFairyTaleContent(newPage);

        const quizEnabled = localStorage.getItem("quizEnabled") === "true";
        if (quizEnabled && (newPage + 1) % 5 === 0) {
          const quizPageNumber = (newPage + 1) / 5;
          getQuizData(quizPageNumber); // 퀴즈 데이터 요청
          setIsQuizModalOpen(true); // 로딩 상태에 따라 모달 표시
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
    if (!isTTSChoiceModalOpen) {
      getTTSPlayback(); // TTS 모달이 닫혔을 때 호출
    }
    getFairyTaleContent(fairytaleCurrentPage); // 페이지 내용 로드
  }, [fairytaleCurrentPage, getFairyTaleContent, isTTSChoiceModalOpen]);

  return (
    <div className="relative h-screen">
      {fairytaleData ? (
        <>
          <img src={fairytaleData.image} alt="동화책 내용 사진" className="w-screen h-screen object-cover" />
          <div className="w-[1100px] h-[160px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-2xl shadow-lg">
            <button className="items-center ml-5" onClick={handlePlayRecordingAudio}>
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

      {audioURL && <audio controls src={audioURL} className="hidden" ref={audioPlayRef}></audio>}
      {/* TTS 선택 모달 */}
      {/* Fix: hasRead => 처음 읽는건지 읽었던 건지 구분 */}
      <TTSChoiceModal
        isOpen={isTTSChoiceModalOpen}
        onClose={handleCloseTTSChoiceModal}
        isReadIng={isReading}
        bookId={bookId}
      />
      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} title={title} />
      {/* 퀴즈 모달 */}
      <QuizModal
        isOpen={isQuizModalOpen && !isQuizDataLoading}
        onClose={handleCloseQuizModal}
        quizData={quizData?.text}
        quizId={quizData?.quizId}
      />
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
