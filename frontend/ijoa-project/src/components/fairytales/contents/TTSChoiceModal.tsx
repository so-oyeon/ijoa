import React, { useEffect, useState } from "react";
import { fairyTaleApi } from "../../../api/fairytaleApi";
import { ChildrenTTSListResponse } from "../../../types/fairytaleTypes";
import closebutton from "/assets/close-button.png";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");
  const [selectedAudioCreated, setSelectedAudioCreated] = useState(false);

  const readAloudEnabled = JSON.parse(localStorage.getItem("readAloudEnabled") || "false");

  useEffect(() => {
    if (!isOpen) return;

    const fetchTTSList = async () => {
      try {
        const response = await fairyTaleApi.getChildrenTTSList(bookId);
        if (response.status === 200) {
          setTtsList(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("fairyTaleApi의 getChildrenTTSList :", error);
        setIsLoading(false);
      }
    };

    fetchTTSList();

    const intervalId = setInterval(fetchTTSList, 30000);
    return () => clearInterval(intervalId);
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    const selectedTTS = ttsList[index];
    setTTSId(selectedTTS.ttsid);
    setPreviousTTSId(selectedTTS.ttsid);
    setSelectedAudioCreated(selectedTTS.audio_created);
  };

  const handleDownloadClick = async (index: number) => {
    const selectedTTS = ttsList[index];

    if (!selectedTTS.audio_created) {
      setIsCreating(true);
      const originalMessage = "다운로드 중이에요! 잠시만 기다려주세요!";
      setCreationMessage(originalMessage);

      try {
        const response = await fairyTaleApi.getTTSAudioBook(bookId, selectedTTS.ttsid);
        if (response.status === 200) {
          setCreationMessage("목소리 생성이 완료됐어요!");
          setIsCreating(false);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("409")) {
          setCreationMessage("열심히 다운로드 중이에요! 조금만 더 기다려주세요! 🔥");

          setTimeout(() => {
            setCreationMessage(originalMessage);
          }, 3000);

          const intervalId = setInterval(async () => {
            const response = await fairyTaleApi.getChildrenTTSList(bookId);
            const updatedTTS = response.data.find((tts: ChildrenTTSListResponse) => tts.ttsid === selectedTTS.ttsid);

            if (updatedTTS && updatedTTS.audio_created) {
              setTtsList((prevList) =>
                prevList.map((tts) => (tts.ttsid === selectedTTS.ttsid ? { ...tts, audio_created: true } : tts))
              );
              setIsCreating(false);
              clearInterval(intervalId);
            }
          }, 5000);
        } else {
          setIsCreating(false);
          setCreationMessage("오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    }
  };

  const handleClose = () => {
    setTTSId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xl mx-4 md:w-1/2 lg:w-1/3 text-center bg-white rounded-2xl shadow-lg relative">
        <div className="px-4 py-12">
          {readAloudEnabled && (
            <>
              <button onClick={handleClose} className="absolute top-4 right-4 text-2xl font-bold">
                <img src={closebutton} alt="닫기 버튼" />
              </button>
              <div className="text-xl font-bold">
                <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
              </div>

              {isLoading ? (
                <div className="mt-8 mb-8 flex justify-center items-center">
                  <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
                </div>
              ) : (
                <>
                  {ttsList.length > 0 ? (
                    <div className="mt-8 mb-8 text-lg">
                      <div
                        className={`flex ${
                          ttsList.length === 4 ? "flex-wrap gap-8 justify-between" : "flex-wrap gap-8 justify-center"
                        }`}
                      >
                        {ttsList.map((tts, index) => (
                          <div
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`relative ${ttsList.length === 4 ? "w-1/2" : "w-auto"}`}
                          >
                            <img
                              src={tts.image}
                              alt={tts.ttsname}
                              className={`w-28 h-28 object-cover cursor-pointer rounded-full ${
                                selectedIndex === index ? "border-[6px] border-[#67CCFF]" : ""
                              }`}
                              onLoad={() => setIsLoading(false)}
                            />
                            <p className="mt-2">{tts.ttsname}</p>
                            {!tts.audio_created && (
                              <button
                                onClick={() => {
                                  handleDownloadClick(index);
                                }}
                                className="absolute inset-0 flex items-center top-[120px] justify-center bg-black bg-opacity-50 text-white text-sm rounded-2xl"
                              >
                                {isCreating && selectedIndex === index ? "다운로드 중" : "다운로드 필요"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 mb-8 text-lg text-center text-gray-500">학습된 TTS가 없어요.</div>
                  )}

                  {isCreating && <p className="text-center text-blue-500">{creationMessage}</p>}
                </>
              )}
            </>
          )}

          {!readAloudEnabled && (
            <div className="text-xl font-bold">
              책 읽어주기 기능이 <span className="red-highlight">off 상태</span>에요.
            </div>
          )}

          {/* 읽기 버튼들 - 선택한 TTS의 audio_created가 true일 때만 활성화 */}
          <div className="mt-8 flex gap-4 justify-center items-center">
            {isReadIng ? (
              <>
                <button
                  className={`w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] ${
                    selectedAudioCreated ? "active:bg-[#e0f7ff]" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (selectedAudioCreated && onContinueReading) onContinueReading();
                  }}
                  disabled={!selectedAudioCreated}
                >
                  이어서 읽기
                </button>
                <button
                  className={`w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] ${
                    selectedAudioCreated ? "active:bg-[#005f99]" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={onClose}
                  disabled={!selectedAudioCreated}
                >
                  처음부터 읽기
                </button>
              </>
            ) : (
              <button
                className={`w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] ${
                  selectedAudioCreated ? "active:bg-[#005f99]" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={onClose}
                disabled={!selectedAudioCreated}
              >
                동화책 읽기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSChoiceModal;
