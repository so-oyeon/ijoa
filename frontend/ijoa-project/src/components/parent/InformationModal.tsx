import React from "react";
import back from "/assets/back.png";

interface InformationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InformationModal: React.FC<InformationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-1/3 py-20 bg-white rounded-lg p-6">
        <button className="absolute w-[50px] top-4 right-4 text-red-500" onClick={onClose}>
          <img src={back} alt="뒤로가기" />
        </button>
        <h1 className="text-center text-gray-700 text-2xl font-bold mb-4">회원정보 변경</h1>
        <div className="flex justify-center items-center mb-4 h-10 gap-5">
          <label className="text-gray-700 font-semibold mr-2">이메일</label>
          <input
            type="email"
            placeholder="본인 이메일"
            className="w-60 p-2 border rounded-lg focus:outline-none focus:border-blue-300"
          />
        </div>
        <div className="flex justify-center items-center mb-4 h-10 gap-5">
          <label className="text-gray-700 font-semibold mr-2">닉네임</label>
          <input
            type="text"
            placeholder="닉네임"
            className="w-60 p-2 border rounded-lg focus:outline-none focus:border-blue-300"
          />
        </div>
        <div className="flex justify-center items-center mb-4 h-10 gap-5">
          <label className="text-gray-700 font-semibold mr-2">새로운 비밀번호</label>
          <input type="password" className="w-60 p-2 border rounded-lg focus:outline-none focus:border-blue-300" />
        </div>
        <div className="flex justify-center items-center mb-4 h-10 gap-5">
          <label className="text-gray-700 font-semibold mr-2">비밀번호 확인</label>
          <input type="password" className="w-60 p-2 border rounded-lg focus:outline-none focus:border-blue-300" />
        </div>
        <button className="w-full py-2 bg-blue-400 text-white rounded-lg font-bold hover:bg-blue-500" onClick={onClose}>
          저장
        </button>
      </div>
    </div>
  );
};

export default InformationModal;
