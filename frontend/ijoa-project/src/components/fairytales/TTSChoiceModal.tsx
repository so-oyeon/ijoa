import React, { useState } from "react";
import Pororo from "/assets/fairytales/images/pororo.png";
import Hachuping from "/assets/fairytales/images/hachuping.png";
import Father from "/assets/fairytales/images/father.png";

interface TTSChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasRead: boolean;
}

const TTSChoiceModal: React.FC<TTSChoiceModalProps> = ({ isOpen, onClose, hasRead }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const ttsImages = [Pororo, Father, Hachuping, Father];
  const ttsNames = ["뽀로로", "아빠", "하츄핑", "엄마"];

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-3xl shadow-lg">
        <div className="px-4 py-8">
          <div className="text-xl font-bold">
            <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
          </div>

          <div className="mt-8 mb-8 text-lg">
            <div className="mb-8 flex flex-wrap justify-center gap-8">
              {ttsImages.slice(0, 2).map((image, index) => (
                <div key={index} onClick={() => handleImageClick(index)}>
                  <img
                    src={image}
                    alt={ttsNames[index]}
                    className={`w-28 cursor-pointer ${
                      selectedIndex === index ? "border-[6px] border-[#67CCFF] rounded-full" : ""
                    }`}
                  />
                  <p className="mt-2">{ttsNames[index]}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {ttsImages.slice(2).map((image, index) => (
                <div key={index + 2} onClick={() => handleImageClick(index + 2)}>
                  <img
                    src={image}
                    alt={ttsNames[index + 2]}
                    className={`w-28 cursor-pointer ${
                      selectedIndex === index + 2 ? "border-[6px] border-[#67CCFF] rounded-full" : ""
                    }`}
                  />
                  <p className="mt-2">{ttsNames[index + 2]}</p>
                </div>
              ))}
            </div>
          </div>

          {hasRead ? (
            <div className="flex gap-4 justify-center items-center">
              <button
                className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose}
              >
                이어서 읽기
              </button>
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose}
              >
                처음부터 읽기
              </button>
            </div>
          ) : (
            <div className="mt-8 text-lg">
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose}
              >
                동화책 읽기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TTSChoiceModal;
