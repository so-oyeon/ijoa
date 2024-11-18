import React from "react";
import Attention from "/assets/fairytales/buttons/attention.png";

interface NotFoundModalProps {
  onClose: () => void;
}

const NotFoundModal: React.FC<NotFoundModalProps> = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <img src={Attention} alt="주의 아이콘" className="w-24 mb-4" />
      </div>
        <p className="font-bold text-2xl mb-4">존재하지 않는 계정입니다.</p>
    </>
  );
};

export default NotFoundModal;
