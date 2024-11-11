import React, { useEffect, useState } from "react";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { ChildrenTTSListResponse } from "../../types/fairytaleTypes";
import closebutton from "/assets/close-button.png";

interface TTSChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadIng: boolean;
  bookId: number;
  setTTSId: (id: number | null) => void;
  setPreviousTTSId: (id: number) => void;
  onContinueReading?: () => void;
}

const TTSChoiceModal: React.FC<TTSChoiceModalProps> = ({
  isOpen,
  onClose,
  isReadIng,
  bookId,
  setTTSId,
  setPreviousTTSId,
  onContinueReading,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [ttsList, setTtsList] = useState<ChildrenTTSListResponse[]>([]);

  const readAloudEnabled = JSON.parse(localStorage.getItem("readAloudEnabled") || "false");

  useEffect(() => {
    if (!isOpen) return;

    const getChildTTSList = async () => {
      if (!bookId) return;

      try {
        const response = await fairyTaleApi.getChildrenTTSList(bookId);
        if (response.status === 200 && Array.isArray(response.data)) {
          setTtsList(response.data);
        }
      } catch (error) {
        console.error("fairyTaleApi의 getChildrenTTSList :", error);
      }
    };

    getChildTTSList();
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const ttsImages = ttsList.map((tts) => tts.image);
  const ttsNames = ttsList.map((tts) => tts.ttsname);
  const ttsIds = ttsList.map((tts) => tts.ttsid);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setTTSId(ttsIds[index]);
    setPreviousTTSId(ttsIds[index]);
  };

  const handleClose = () => {
    setTTSId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-2xl shadow-lg relative">
        <div className="px-4 py-12">
          {/* readAloudEnabled가 true일 때만 헤더와 TTS 선택 섹션 표시 */}
          {readAloudEnabled && (
            <>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-2xl font-bold"
              >
                <img src={closebutton} alt="닫기 버튼" />
              </button>
              <div className="text-xl font-bold">
                <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
              </div>

              {ttsImages.length > 0 ? (
                <div className="mt-8 mb-8 text-lg">
                  <div className="flex flex-wrap justify-center gap-8">
                    {ttsImages.slice(0, 2).map((image, index) => (
                      <div key={index} onClick={() => handleImageClick(index)}>
                        <img
                          src={image}
                          alt={ttsNames[index]}
                          className={`w-28 h-28 object-cover cursor-pointer rounded-full ${
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
                          className={`w-28 h-28 object-cover cursor-pointer rounded-full ${
                            selectedIndex === index + 2 ? "border-[6px] border-[#67CCFF] rounded-full" : ""
                          }`}
                        />
                        <p className="mt-2">{ttsNames[index + 2]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8 mb-8 text-lg text-center text-gray-500">학습된 TTS가 없어요.</div>
              )}
            </>
          )}

          {!readAloudEnabled && (
            <div className="text-xl font-bold">
              책 읽어주기 기능이 <span className="red-highlight">off 상태</span>에요.
            </div>
          )}

          {isReadIng ? (
            <div className="mt-8 flex gap-4 justify-center items-center">
              <button
                className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff]"
                onClick={() => {
                  if (onContinueReading) onContinueReading();
                }}
              >
                이어서 읽기
              </button>
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99]"
                onClick={onClose}
              >
                처음부터 읽기
              </button>
            </div>
          ) : (
            <div className="mt-8 text-lg">
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99]"
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
