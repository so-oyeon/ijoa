import React from "react";

interface WithoutTTSConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const WithoutTTSConfirmModal: React.FC<WithoutTTSConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center font-semibold">
        <p className="text-xl mb-6">
          책 읽어주기 <span className="red-highlight">기능 없이</span> 책을 읽을까요?
        </p>
        <div className="flex justify-around">
          <button className="px-6 py-2 bg-[#FF8067] text-white rounded-3xl active:bg-red-500" onClick={onCancel}>
            아니오
          </button>
          <button className="px-9 py-2 bg-[#67CCFF] text-white rounded-3xl active:bg-[#005f99]" onClick={onConfirm}>
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithoutTTSConfirmModal;
