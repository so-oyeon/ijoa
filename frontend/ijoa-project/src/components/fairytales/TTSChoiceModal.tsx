import React, { useEffect, useState } from "react";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { ChildrenTTSListResponse } from "../../types/fairytaleTypes";

interface TTSChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasRead: boolean;
  bookId: number;
}

const TTSChoiceModal: React.FC<TTSChoiceModalProps> = ({ isOpen, onClose, hasRead, bookId }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [ttsList, setTtsList] = useState<ChildrenTTSListResponse[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // 자녀 TTS 목록을 가져오는 api 통신 함수
    const getTTSList = async () => {
      if (!bookId) {
        console.error("Book ID is undefined");
        return;
      }

      try {
        const response = await fairyTaleApi.getChildrenTTSList(bookId);
        if (response.status === 200 && Array.isArray(response.data)) {
          setTtsList(response.data);
          console.log(response)
        }
      } catch (error) {
        console.error("fairyTaleApi의 getChildrenTTSList :", error);
      }
    };

    getTTSList();
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const ttsImages = ttsList.map((tts) => tts.image);
  const ttsNames = ttsList.map((tts) => tts.ttsname);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-2xl shadow-lg">
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
                className={`w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] ${
                  selectedIndex === null ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onClose}
                disabled={selectedIndex === null}
              >
                이어서 읽기
              </button>
              <button
                className={`w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] ${
                  selectedIndex === null ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onClose}
                disabled={selectedIndex === null}
              >
                처음부터 읽기
              </button>
            </div>
          ) : (
            <div className="mt-8 text-lg">
              <button
                className={`w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] ${
                  selectedIndex === null ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onClose}
                disabled={selectedIndex === null}
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
