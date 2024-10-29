import React, { useState } from "react";
import "./FairytaleContentPage.css";
import MenuButton from "/assets/fairytales/buttons/MenuButton.png";
import SoundOnButton from "/assets/fairytales/buttons/SoundOnButton.png";
import LeftArrow from "/assets/fairytales/buttons/LeftArrow.png";
import RightArrow from "/assets/fairytales/buttons/RightArrow.png";
import dummy1 from "/assets/fairytales/images/dummy1.png";
import dummy2 from "/assets/fairytales/images/dummy2.png";
import dummy3 from "/assets/fairytales/images/dummy3.png";
import SettingsIcon from "/assets/fairytales/buttons/SettingsIcon.png";

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
  const [fairytaleCurrentPage, setfairytaleCurrentPage] = useState(0); // 현재 페이지를 추적하는 상태 변수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창의 켜짐 여부를 추적하는 상태 변수

  // 좌측 화살표 버튼 클릭 시 호출되는 함수
  // 현재 페이지가 첫 페이지보다 크면, 이전 페이지로 이동
  const handleLeftClick = () => {
    if (fairytaleCurrentPage > 0) {
      setfairytaleCurrentPage(fairytaleCurrentPage - 1);
    }
  };

  // 우측 화살표 버튼 클릭 시 호출되는 함수
  // 현재 페이지가 마지막 페이지보다 작으면, 다음 페이지로 이동
  const handleRightClick = () => {
    if (fairytaleCurrentPage < fairyTales.length - 1) {
      setfairytaleCurrentPage(fairytaleCurrentPage + 1);
    }
  };

  // 모달창 띄우는 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative h-screen">
      {/* 현재 페이지 배경사진 */}
      <img src={fairyTales[fairytaleCurrentPage].image} alt="동화책 내용 사진" className="w-screen h-screen" />

      {/* 우측 상단 메뉴 버튼 */}
      <div className="absolute top-[-12px] right-10">
        <button onClick={toggleModal} className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md">
          <img src={MenuButton} alt="메뉴 버튼" />
          <p className="text-xs text-white">메뉴</p>
        </button>
      </div>

      {/* 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="w-1/3 py-8 text-center bg-white rounded-xl shadow-lg">
            <div className="flex justify-center items-center mb-6">
              <img src={SettingsIcon} alt="설정 아이콘" className="w-12 h-12" />
            </div>
            <div className="text-xl font-bold">
              <span className="blue-highlight">기본 설정</span>을 선택해 주세요.
            </div>

            {/* 토글 버튼 */}
            <div className="mt-6 flex justify-center">
              <div className="space-y-3">
                <label className="label cursor-pointer flex items-center gap-16">
                  <span className="text-lg flex-grow text-center">책 읽어주기</span>
                  <input type="checkbox" className="toggle custom-toggle" defaultChecked />
                </label>
                <label className="label cursor-pointer flex items-center gap-16">
                  <span className="text-lg flex-grow text-center">퀴즈</span>
                  <input type="checkbox" className="toggle custom-toggle" defaultChecked />
                </label>
                <label className="label cursor-pointer flex items-center gap-16">
                  <span className="text-lg flex-grow text-center">bgm</span>
                  <input type="checkbox" className="toggle custom-toggle" defaultChecked />
                </label>
              </div>
            </div>

            {/* 취소/완료 버튼 */}
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={toggleModal}
                className="mt-6 px-8 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border border-2 border-[#67CCFF]"
              >
                취소
              </button>
              <button onClick={toggleModal} className="mt-6 px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border border-2 border-[#67CCFF]">
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 중앙 하단 동화 내용 */}
      <div className="w-3/4 h-[140px] p-4 flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-between items-center bg-white bg-opacity-70 rounded-3xl shadow-lg">
        {/* 다시 듣기 버튼 */}
        <button className="items-center ml-5">
          <img src={SoundOnButton} alt="다시 듣기 버튼" className="w-20 h-20" />
          <p className="text-sm text-[#565656] font-bold">다시 듣기</p>
        </button>
        {/* 동화 내용 텍스트 */}
        <p className="text-3xl font-bold text-center break-words flex-1 fairytale-content">
          {fairyTales[fairytaleCurrentPage].text}
        </p>
      </div>

      {/* 좌측 화살표 버튼 */}
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
        <button className="bg-transparent border-none" onClick={handleLeftClick}>
          <img src={LeftArrow} alt="왼쪽 화살표" />
        </button>
      </div>

      {/* 우측 화살표 버튼 */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <button className="bg-transparent border-none" onClick={handleRightClick}>
          <img src={RightArrow} alt="오른쪽 화살표" />
        </button>
      </div>
    </div>
  );
};

export default FairyTaleContentPage;
