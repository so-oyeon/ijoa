import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FairytaleContentPage.css";
import ReadCompleteModal from "../../components/fairytales/ReadCompleteModal";
import LevelUpModal from "../../components/fairytales/LevelUpModal";
import TTSChoiceModal from "../../components/fairytales/TTSChoiceModal";
import MenuButton from "/assets/fairytales/buttons/menu-button.png";
import SoundOnButton from "/assets/fairytales/buttons/sound-on-button.png";
import LeftArrow from "/assets/fairytales/buttons/left-arrow.png";
import RightArrow from "/assets/fairytales/buttons/right-arrow.png";
import dummy1 from "/assets/fairytales/images/dummy1.png";
import dummy2 from "/assets/fairytales/images/dummy2.png";
import dummy3 from "/assets/fairytales/images/dummy3.png";

// 더미 데이터
const fairyTales = [
  {
    image: dummy1,
    text: "준비~ 땅! 토끼와 거북이의 달리기 대결이 시작됐어요.",
  },
  {
    image: dummy2,
    text: "느림보가 어디쯤 오나? 헤헤. 쫓아오려면 아직도 멀었네. 한숨 자야지.",
  },
  {
    image: dummy3,
    text: "동물 친구들은 하하호호 웃으며 즐거워했어요.",
  },
];

const FairyTaleContentPage: React.FC = () => {
  const location = useLocation();
  const { title } = location.state || { title: "제목 없음" };
  const [fairytaleCurrentPage, setFairytaleCurrentPage] = useState(0);
  const [isTTSChoiceModalOpen, setIsTTSChoiceModalOpen] = useState(true);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isReadCompleteModalOpen, setIsReadCompleteModalOpen] = useState(false);

  // 왼쪽 화살표 클릭 시 현재 페이지를 감소시키는 함수
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      setFairytaleCurrentPage(fairytaleCurrentPage - 1);
    }
  };

  // 오른쪽 화살표 클릭 시 현재 페이지를 증가시키는 함수
  const handleRightClick = () => {
    if (fairytaleCurrentPage < fairyTales.length - 1) {
      setFairytaleCurrentPage(fairytaleCurrentPage + 1);
    } else {
      // Fix: 레벨 업 요건 충족 시 켜지도록 추후 수정!
      setIsLevelUpModalOpen(true);
    }
  };

  // TTS 선택 모달을 닫는 함수
  const handleCloseTTSChoiceModal = () => {
    setIsTTSChoiceModalOpen(false);
  };

  // 레벨 업 모달이 열릴 때 3초 후에 읽기 완료 모달을 여는 타이머 설정하는 useEffect
  useEffect(() => {
    if (isLevelUpModalOpen) {
      const timer = setTimeout(() => {
        setIsLevelUpModalOpen(false);
        setIsReadCompleteModalOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLevelUpModalOpen]);

  return (
    <div className="relative h-screen">
      <img src={fairyTales[fairytaleCurrentPage].image} alt="동화책 내용 사진" className="w-screen h-screen" />

      <div className="absolute top-[-12px] right-10">
        <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md">
          <img src={MenuButton} alt="메뉴 버튼" />
          <p className="text-xs text-white">메뉴</p>
        </button>
      </div>

      <div className="w-3/4 h-[140px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-3xl shadow-lg">
        <button className="items-center ml-5">
          <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-20 h-20" />
          <p className="text-sm text-[#565656] font-bold">다시 듣기</p>
        </button>
        <p className="text-3xl font-bold text-center break-words flex-1 fairytale-font">
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
      <TTSChoiceModal isOpen={isTTSChoiceModalOpen} onClose={handleCloseTTSChoiceModal} />
      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} title={title} />
    </div>
  );
};

export default FairyTaleContentPage;
