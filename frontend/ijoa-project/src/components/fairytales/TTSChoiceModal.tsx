import React from "react";
import Pororo from "/assets/fairytales/images/pororo.png";
import Hachuping from "/assets/fairytales/images/hachuping.png";
import Father from "/assets/fairytales/images/father.png";

interface TTSChoiceModalProps {
  isOpen: boolean;
  onClose: () => void; // 모달을 닫는 함수 추가
  hasRead: boolean; // 읽은 적 있는지 여부
}

const TTSChoiceModal: React.FC<TTSChoiceModalProps> = ({ isOpen, onClose, hasRead }) => {
  if (!isOpen) return null;

  // TTS 이미지 배열 예시 데이터
  const ttsImages = [Pororo, Father, Hachuping, Father];
  // TTS 이름 배열 예시 데이터
  const ttsNames = ["뽀로로", "아빠", "하츄핑", "엄마"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-3xl shadow-lg">
        <div className="px-4 py-8">
          <div className="text-xl font-bold">
            <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
          </div>

          <div className="mt-8 mb-8 text-lg">
            <div className="mb-8 flex flex-wrap justify-center gap-8">
              {ttsImages.length > 0 && (
                <div>
                  <img src={ttsImages[0]} alt="뽀로로" className="w-28" />
                  <p className="mt-2">{ttsNames[0]}</p>
                </div>
              )}
              {ttsImages.length > 1 && (
                <div>
                  <img src={ttsImages[1]} alt="하츄핑" className="w-28" />
                  <p className="mt-2">{ttsNames[1]}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {ttsImages.length > 2 && (
                <div>
                  <img src={ttsImages[2]} alt="아빠" className="w-28" />
                  <p className="mt-2">{ttsNames[2]}</p>
                </div>
              )}
              {ttsImages.length > 3 && (
                <div>
                  <img src={ttsImages[3]} alt="아빠" className="w-28" />
                  <p className="mt-2">{ttsNames[3]}</p>
                </div>
              )}
            </div>
          </div>

          {hasRead ? (
            <div className="flex gap-4 justify-center items-center">
              <button
                className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose} // 이어서 읽기 버튼 클릭 시 모달 닫기
              >
                이어서 읽기
              </button>
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose} // 처음부터 읽기 버튼 클릭 시 모달 닫기
              >
                처음부터 읽기
              </button>
            </div>
          ) : (
            <div className="mt-8 text-lg">
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
                onClick={onClose} // 동화책 읽기 버튼 클릭 시 모달 닫기
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
