import React from "react";
import { useNavigate } from "react-router-dom";
import CompleteBadge from "/assets/fairytales/buttons/complete-badge.png";
import Animals from "/assets/fairytales/images/animals.png";

interface ReadCompleteModalProps {
  isOpen: boolean;
  title: string;
}

const ReadCompleteModal: React.FC<ReadCompleteModalProps> = ({ isOpen, title = "" }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // 한글 받침에 따라 조사를 결정하는 함수
  const getReadingMessage = (title: string) => {
    if (!title) return "책을 다 읽었어요!\n다음엔 또 무슨 책을 읽어볼까?";
  
    const lastChar = title.charAt(title.length - 1);
    const code = lastChar.charCodeAt(0);
  
    const hasBatchim = (code - 0xac00) % 28 !== 0;
    const particle = hasBatchim ? "을" : "를";
  
    return `${title}${particle} 다 읽었어요!\n다음엔 또 무슨 책을 읽어볼까?`;
  };
  

  const message = getReadingMessage(title);

  // 홈으로 렌더링하는 함수
  const toHome = () => {
    navigate("/child/fairytale/list");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-2xl shadow-lg">
        <div className="px-4 py-8">
          <div className="mb-6 flex justify-center items-center">
            <img src={CompleteBadge} alt="독서 완료 뱃지" />
          </div>
          <div className="text-2xl font-bold text-center fairytale-font whitespace-pre-line">{message}</div>
          <button
            className="mt-6 px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF]"
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
