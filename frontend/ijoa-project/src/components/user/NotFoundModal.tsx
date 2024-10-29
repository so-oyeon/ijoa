import React from "react";

interface NotFoundModalProps {
  onClose: () => void;
}

const NotFoundModal: React.FC<NotFoundModalProps> = ({ onClose }) => {
  return (
    <>
      <p className="font-bold text-2xl mb-4 text-red-600">존재하지 않는 계정입니다.</p>
      <button onClick={onClose} className="w-3/5 py-3 font-bold bg-yellow-400 rounded-full hover:bg-yellow-500">
        닫기
      </button>
    </>
  );
};

export default NotFoundModal;
