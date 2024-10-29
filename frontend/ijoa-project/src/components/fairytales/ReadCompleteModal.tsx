import React from "react";
import CompleteBadge from "/assets/fairytales/buttons/complete-badge.png";

interface ReadCompleteModalProps {
  isOpen: boolean;
}

const Modal: React.FC<ReadCompleteModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  const toHome = () => {
    console.log("home으로");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 px-4 py-8 text-center bg-white rounded-xl shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <img src={CompleteBadge} alt="독서 완료 뱃지" />
        </div>
        <div className="text-2xl font-bold text-center fairytale-font">
          "토끼와 거북이"를 다 읽었어요! 다음엔 또 무슨 책을 읽어볼까?
        </div>
        <button
          className="mt-6 px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border border-2 border-[#67CCFF]"
          onClick={toHome}
        >
          목록 화면으로
        </button>
      </div>
    </div>
  );
};

export default Modal;
