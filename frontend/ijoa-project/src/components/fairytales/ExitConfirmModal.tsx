import React from "react";
import { useNavigate } from "react-router-dom";

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // 취소 버튼 클릭 핸들러
  const closeExitConfirmModal = () => {
    onClose(); 
  }

  // 나가기 버튼 클릭 핸들러
  const handleExitClick = () => {
    navigate("/fairytale/list");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-2xl shadow-lg">
        <div className="px-4 py-8">
          <div className="text-2xl font-bold">정말로 나가시겠습니까?</div>
          <div className="flex gap-4 justify-center items-center">
            <button
              onClick={closeExitConfirmModal}
              className="mt-6 w-28 py-2 text-white text-lg font-bold bg-[#FF8067] rounded-2xl border-2 border-[#FF8067]"
            >
              취소
            </button>
            <button
              onClick={handleExitClick}
              className="mt-6 w-28 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF]"
            >
              나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmModal;
