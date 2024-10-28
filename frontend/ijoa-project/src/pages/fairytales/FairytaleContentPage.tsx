import React from "react";
import FairyTaleContent from "/assets/fairytales/FairytaleContent.png";
import MenuButton from "/assets/fairytales/MenuButton.png";

const FairyTaleContentPage: React.FC = () => {
  return (
    <div>
      <img src={FairyTaleContent} alt="동화책 내용 사진" className="w-screen h-screen" />
      <div className="absolute top-[-12px] right-10">
        <button className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md hover:bg-gray-200 hover:bg-opacity-80">
          <img src={MenuButton} alt="메뉴 버튼" />
          <p className="text-xs text-white">메뉴</p>
        </button>
      </div>
    </div>
  );
};

export default FairyTaleContentPage;
