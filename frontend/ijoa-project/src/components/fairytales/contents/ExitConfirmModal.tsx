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
  };

  // 나가기 버튼 클릭 핸들러
  const handleExitClick = () => {
    navigate("/child/fairytale/list");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-full max-w-xs md:max-w-md lg:max-w-lg text-center bg-white rounded-2xl shadow-lg mx-4">
        <div className="px-4 py-8">
          <div className="text-xl md:text-2xl font-bold">정말로 나가시겠습니까?</div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
            <button
              onClick={closeExitConfirmModal}
              className="w-full md:w-28 py-2 text-white text-lg font-bold bg-[#FF8067] rounded-2xl border-2 border-[#FF8067] active:bg-red-500"
            >
              취소
            </button>
            <button
              onClick={handleExitClick}
              className="w-full md:w-28 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF] active:bg-[#005f99]"
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
