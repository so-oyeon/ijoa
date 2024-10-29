import React, { useState, useEffect } from "react";
import "./FairytaleContentPage.css";
import ReadCompleteModal from "../../components/fairytales/ReadCompleteModal";
import LevelUpModal from "../../components/fairytales/LevelUpModal";
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
    image: dummy1, // 첫 번째 페이지 배경 이미지
    text: "준비~ 땅! 토끼와 거북이의 달리기 대결이 시작됐어요.", // 첫 번째 페이지 대사
  },
  {
    image: dummy2, // 두 번째 페이지 배경 이미지
    text: "느림보가 어디쯤 오나? 헤헤. 쫓아오려면 아직도 멀었네. 한숨 자야지.", // 두 번째 페이지 대사
  },
  {
    image: dummy3, // 세 번째 페이지 배경 이미지
    text: "동물 친구들은 하하호호 웃으며 즐거워했어요.", // 세 번째 페이지 대사
  },
];

const FairyTaleContentPage: React.FC = () => {
  const [fairytaleCurrentPage, setFairytaleCurrentPage] = useState(0); // 현재 페이지를 추적하는 상태 변수
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isReadCompleteModalOpen, setIsReadCompleteModalOpen] = useState(false);

  // 좌측 화살표 버튼 클릭 시 호출되는 함수 (현재 페이지가 첫 페이지보다 크면, 이전 페이지로 이동)
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      setFairytaleCurrentPage(fairytaleCurrentPage - 1);
    }
  };

  // 우측 화살표 버튼 클릭 시 호출되는 함수 (현재 페이지가 마지막 페이지보다 작으면, 다음 페이지로 이동)
  const handleRightClick = () => {
    if (fairytaleCurrentPage < fairyTales.length - 1) {
      setFairytaleCurrentPage(fairytaleCurrentPage + 1);
    } else {
      setIsLevelUpModalOpen(true); // Fix: 추후에 특정 조건 만족 시 레벨업 모달 뜨도록 수정
    }
  };

  // 레벨업 모달 5초 노출 후 독서 완료 모달 열리도록
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
      {/* 현재 페이지 배경사진 */}
      <img src={fairyTales[fairytaleCurrentPage].image} alt="동화책 내용 사진" className="w-screen h-screen" />

      {/* 우측 상단 메뉴 버튼 */}
      <div className="absolute top-[-12px] right-10">
        <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md">
          <img src={MenuButton} alt="메뉴 버튼" />
          <p className="text-xs text-white">메뉴</p>
        </button>
      </div>

      {/* 중앙 하단 동화 내용 */}
      <div className="w-3/4 h-[140px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-3xl shadow-lg">
        {/* 다시 듣기 버튼 */}
        <button className="items-center ml-5">
          <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-20 h-20" />
          <p className="text-sm text-[#565656] font-bold">다시 듣기</p>
        </button>
        {/* 동화 내용 텍스트 */}
        <p className="text-3xl font-bold text-center break-words flex-1 fairytale-font">
          {fairyTales[fairytaleCurrentPage].text}
        </p>
      </div>

      {/* 좌측 화살표 버튼 - 첫 페이지일 경우 숨김 */}
      {fairytaleCurrentPage > 0 && (
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
          <button className="bg-transparent border-none" onClick={handleLeftClick}>
            <img src={LeftArrow} alt="왼쪽 화살표" />
          </button>
        </div>
      )}

      {/* 우측 화살표 버튼 */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <button className="bg-transparent border-none" onClick={handleRightClick}>
          <img src={RightArrow} alt="오른쪽 화살표" />
        </button>
      </div>

      {/* 레벨업 모달 */}
      <LevelUpModal isOpen={isLevelUpModalOpen} />
      {/* 독서 완료 모달 */}
      <ReadCompleteModal isOpen={isReadCompleteModalOpen} />
    </div>
  );
};

export default FairyTaleContentPage;
