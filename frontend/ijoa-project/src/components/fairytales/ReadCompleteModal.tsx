import React from "react";
import { useNavigate } from "react-router-dom";
import CompleteBadge from "/assets/fairytales/buttons/complete-badge.png";
import Animals from "/assets/fairytales/images/animals.png";

interface ReadCompleteModalProps {
  isOpen: boolean;
}

const ReadCompleteModal: React.FC<ReadCompleteModalProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // 홈으로 렌더링하는 함수
  const toHome = () => {
    navigate("/fairytale/list");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-3xl shadow-lg">
        <div className="px-4 py-8">
          <div className="mb-6 flex justify-center items-center">
            <img src={CompleteBadge} alt="독서 완료 뱃지" />
          </div>
          <div className="text-2xl font-bold text-center fairytale-font whitespace-pre-line">
            {'"토끼와 거북이"를 다 읽었어요!\n다음엔 또 무슨 책을 읽어볼까?'}
          </div>
          <button
            className="mt-6 px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border border-2 border-[#67CCFF]"
            onClick={toHome}
          >
            목록 화면으로
          </button>
        </div>
        <img src={Animals} alt="동물들" className="w-full" />
      </div>
    </div>
  );
};

export default ReadCompleteModal;
