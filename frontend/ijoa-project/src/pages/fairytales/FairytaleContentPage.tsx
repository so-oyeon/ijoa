import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../../css/FairytaleContentPage.css";

import ReadCompleteModal from "../../components/fairytales/contents/ReadCompleteModal";
import LevelUpModal from "../../components/fairytales/contents/LevelUpModal";
import TTSChoiceModal from "../../components/fairytales/contents/TTSChoiceModal";
import QuizModal from "../../components/fairytales/contents/QuizModal";
import FocusAlertModal from "../../components/fairytales/contents/FocusAlertModal";
import FairytaleMenu from "../../components/fairytales/contents/FairytaleMenu";
import SeesoComponent from "../../components/seeso/SeesoComponent";

import MenuButton from "/assets/fairytales/buttons/menu-button.png";
import SoundOnButton from "/assets/fairytales/buttons/sound-on-button.png";
import LeftArrow from "/assets/fairytales/buttons/left-arrow.png";
import RightArrow from "/assets/fairytales/buttons/right-arrow.png";

import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleContentResponse, FairyTalePageResponse, QuizQuestionResponse } from "../../types/fairytaleTypes";
import { WordPositionInfo } from "../../types/seesoTypes";

import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/footPrint-loadingAnimation.json";

const FairyTaleContentPage: React.FC = () => {
  const { fairytaleId } = useParams<{ fairytaleId: string }>();
  const location = useLocation();
  const title = location.state?.title;
  const currentPage = location.state?.currentPage;
  const totalPages = location.state?.totalPages;
  const from = location.state?.from;
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
  const [previousTTSId, setPreviousTTSId] = useState<number | null>(null);
  const [ttsId, setTTSId] = useState<number | null>(null);
  const [shownQuizPages, setShownQuizPages] = useState<number[]>([]);

  const bookId = fairytaleId ? parseInt(fairytaleId, 10) : 0;
  const isReading = currentPage > 0 && currentPage != totalPages;

  // Seeso eye-tracking 글자 추출을 위한 word 배열
  const [wordPositions, setWordPositions] = useState<WordPositionInfo[]>([]);

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

  // TTS 낭독 API 호출 및 재생
  const getTTSPlayback = async () => {
    try {
      if (ttsId) {
        const page = fairytaleCurrentPage + 1;
        const response = await fairyTaleApi.getTTSPlayback(ttsId, bookId, page);

        if (response.status === 200 && response.data?.url) {
          const audioUrl = response.data.url;
          setAudioURL(audioUrl); // 새로운 오디오 URL 설정

          setTimeout(() => {
            if (audioPlayRef.current) {
              audioPlayRef.current.play(); // 오디오 재생
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("fairyTaleApi의 getTTSPlayback :", error);
    }
  };

  const handlePlayRecordingAudio = () => {
    if (ttsId) {
      getTTSPlayback();
    }
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
        if (
          quizEnabled &&
          (newPage + 1) % 5 === 0 &&
          !shownQuizPages.includes(newPage) // 이미 나온 페이지가 아닌 경우에만 퀴즈 모달 열기
        ) {
          const quizPageNumber = (newPage + 1) / 5;
          getQuizData(quizPageNumber); // 퀴즈 데이터 요청
          setIsQuizModalOpen(true); // 로딩 상태에 따라 모달 표시
          setShownQuizPages((prevPages) => [...prevPages, newPage]); // 페이지 기록
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

  // toggleSound 함수 호출 시 이전 ttsId 저장 로직을 추가하여 수정
  const handleToggleTTS = (isSoundOn: boolean) => {
    if (!isSoundOn) {
      // TTS가 꺼질 때만 이전 ID를 저장
      setPreviousTTSId(ttsId);
      setTTSId(null); // 현재 TTS를 비활성화
    } else {
      // TTS가 켜질 때 이전 TTS ID를 복원
      setTTSId(previousTTSId);
    }
  };

  const handleContinueReading = () => {
    setFairytaleCurrentPage(currentPage - 1); //
    setIsTTSChoiceModalOpen(false); // 모달 닫기
  };

  // 단어 위치 추출 함수
  const extractWordPositions = () => {
    const textContainer = document.querySelector(".seeso-text-container") as HTMLElement;
    if (!textContainer) {
      console.error("text-container element not found");
      return;
    }

    const words = textContainer.innerText.split(" ");
    textContainer.innerText = ""; // 기존 텍스트를 지움

    const positions = words.map((word) => {
      const span = document.createElement("span");
      span.innerText = word + " ";
      textContainer.appendChild(span);

      const rect = span.getBoundingClientRect();
      return {
        word,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    setWordPositions(positions);
    console.log("Extracted word positions:", positions); // 좌표 정보 확인
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
    getFairyTaleContent(fairytaleCurrentPage); // 페이지 내용 로드
  }, [fairytaleCurrentPage, getFairyTaleContent, isTTSChoiceModalOpen, isQuizModalOpen]);

  useEffect(() => {
    if (ttsId !== null && !isTTSChoiceModalOpen && !isQuizModalOpen) {
      getTTSPlayback();
    }
  }, [ttsId, fairytaleCurrentPage]);

  // QuizModal 열림 상태 변화에 따른 오디오 제어
  useEffect(() => {
    if (isQuizModalOpen && audioPlayRef.current) {
      // QuizModal이 열리면 오디오를 멈추고, 현재 재생 위치를 처음으로 돌림
      audioPlayRef.current.pause();
      audioPlayRef.current.currentTime = 0;
    } else if (!isQuizModalOpen && !isTTSChoiceModalOpen) {
      // QuizModal과 TTSChoiceModal이 모두 닫혀 있을 때만 TTS 낭독 재생
      getTTSPlayback();
    }
  }, [isQuizModalOpen, isTTSChoiceModalOpen, fairytaleCurrentPage]);

  // 단어 위치 정보 추출
  useEffect(() => {
    if (!fairytaleData) return;

    extractWordPositions();
  }, [fairytaleData]);

  return (
    <div className="relative h-screen">
      {fairytaleData ? (
        <>
          <img src={fairytaleData.image} alt="동화책 내용 사진" className="w-screen h-screen object-cover" />
          <div className="w-[320px] sm:w-[600px] lg:w-[1100px] h-auto p-4 py-6 flex flex-col sm:flex-row absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-center sm:justify-between items-center bg-white bg-opacity-70 rounded-2xl shadow-lg">
            {ttsId && (
              <button className="items-center active:scale-110 mb-4 sm:mb-0" onClick={handlePlayRecordingAudio}>
                <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-12 h-12 sm:w-20 sm:h-20" />
                {/* sm 이하에서는 텍스트를 숨깁니다 */}
                <p className="text-sm text-[#565656] font-bold hidden sm:block">다시 듣기</p>
              </button>
            )}

            {/* Seeso 시선 추적 글자 처리를 위해 seeso-text-container 클래스명 필요 */}
            <div className="seeso-text-container px-2 sm:px-12 flex-1 text-sm sm:text-2xl lg:text-4xl font-['MapleBold'] font-bold text-center whitespace-pre-line break-keep">
              {fairytaleData.content}
            </div>
          </div>

          {fairytaleCurrentPage > 0 && (
            <div className="absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2">
              <button className="bg-transparent border-none active:scale-125" onClick={handleLeftClick}>
                <img src={LeftArrow} alt="왼쪽 화살표" className="w-16 md:w-32" />
              </button>
            </div>
          )}

          <div className="absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2">
            <button className="bg-transparent border-none active:scale-125" onClick={handleRightClick}>
              <img src={RightArrow} alt="오른쪽 화살표" className="w-16 md:w-32" />
            </button>
          </div>

          {/* 메뉴 버튼 */}
          <div className="absolute top-[-12px] right-10">
            <button
              className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md active:bg-gray-800"
              onClick={handleOpenMenu}>
              <img src={MenuButton} alt="메뉴 버튼" />
              <p className="text-xs text-white">메뉴</p>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        </div>
      )}

      {audioURL && <audio controls src={audioURL} className="hidden" ref={audioPlayRef}></audio>}
      {/* TTS 선택 모달 */}
      {isTTSChoiceModalOpen && (
        <TTSChoiceModal
          isOpen={isTTSChoiceModalOpen}
          onClose={handleCloseTTSChoiceModal}
          isReadIng={isReading}
          bookId={bookId}
          setTTSId={setTTSId}
          setPreviousTTSId={setPreviousTTSId}
          onContinueReading={handleContinueReading}
        />
      )}
      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} title={title} from={from} />
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
        handleToggleTTS={handleToggleTTS} // 새 toggle 함수 전달
        audioPlayRef={audioPlayRef}
        ttsId={ttsId}
        previousTTSId={previousTTSId}
      />
      {/* 집중 알람 모달 */}
      <FocusAlertModal isOpen={isFocusAlertModalOpen} onClose={handleCloseFocusAlertModal} />

      {/* Seeso eye-tracking 컴포넌트 호출 */}
      <SeesoComponent wordPositions={wordPositions} />
    </div>
  );
};

export default FairyTaleContentPage;
