import React from "react";
import Pororo from "/assets/fairytales/images/pororo.png";
import Hachuping from "/assets/fairytales/images/hachuping.png"
import Father from "/assets/fairytales/images/father.png"
import Mother from "/assets/fairytales/images/mother.png"

interface TTSChoiceModalProps {
  isOpen: boolean;
}

const TTSChoiceModal: React.FC<TTSChoiceModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  // TTS 이미지 배열 예시 데이터
  const images = [Pororo, Hachuping, Father, Mother]; // 이미지 개수에 따라 조정

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-3xl shadow-lg">
        <div className="px-4 py-8">
          <div className="text-xl font-bold">
            <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
          </div>

          <div className="mt-8 mb-8">
            <div className="mb-8 flex flex-wrap justify-center gap-8">
              {images.length > 0 && (
                <img src={images[0]} alt="뽀로로" className="w-28" />
              )}
              {images.length > 1 && (
                <img src={images[1]} alt="하츄핑" className="w-28" />
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {images.length > 2 && (
                <img src={images[2]} alt="아빠" className="w-28" />
              )}
              {images.length > 3 && (
                <img src={images[3]} alt="엄마" className="w-28" />
              )}
            </div>
          </div>

          {/* 취소/완료 버튼 */}
          <div className="flex gap-4 justify-center items-center">
            <button className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF]">
              이어서 읽기
            </button>
            <button className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]">
              처음부터 읽기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSChoiceModal;
