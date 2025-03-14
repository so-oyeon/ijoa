import React, { useEffect, useState } from "react";
import { fairyTaleApi } from "../../../api/fairytaleApi";
import { ChildrenTTSListResponse } from "../../../types/fairytaleTypes";
import closebutton from "/assets/close-button.png";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";
import DownloadingModal from "./DownloadingModal";
import WithoutTTSConfirmModal from "./WithoutTTSConfirmModal";

interface TTSChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadIng: boolean;
  bookId: number;
  setTTSId: (id: number | null) => void;
  setPreviousTTSId: (id: number | null) => void;
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");
  const [downloadInterval, setDownloadInterval] = useState<NodeJS.Timeout | null>(null);

  const readAloudEnabled = JSON.parse(localStorage.getItem("readAloudEnabled") || "false");

  const [isWithoutTTSConfirmModalOpen, setIsWithoutTTSConfirmModalOpen] = useState(false);

  const handleModalConfirm = () => {
    onClose();
    setIsWithoutTTSConfirmModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsWithoutTTSConfirmModalOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const getChildTTSList = async () => {
      if (!bookId) return;

      try {
        const response = await fairyTaleApi.getChildrenTTSList(bookId);
        if (response.status === 200 && Array.isArray(response.data)) {
          setTtsList(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("fairyTaleApi의 getChildrenTTSList :", error);
        setIsLoading(false);
      }
    };

    getChildTTSList();

    return () => {
      // 컴포넌트 언마운트 시 interval 클리어
      if (downloadInterval) {
        clearInterval(downloadInterval);
        setDownloadInterval(null);
      }
    };
  }, [isOpen, bookId, downloadInterval]);

  const startDownloadCheck = async (ttsId: number) => {
    try {
      if (isDownloading) {
        setCreationMessage("열심히 다운로드 중이에요! 잠시 후 다시 시도해주세요! 🔥");

        setTimeout(() => {
          setCreationMessage("");
        }, 3000);
        return;
      }

      const response = await fairyTaleApi.getTTSAudioBook(bookId, ttsId);
      if (response.status === 200) {
        setIsDownloading(true);

        const interval = setInterval(async () => {
          const ttsResponse = await fairyTaleApi.getChildrenTTSList(bookId);
          if (ttsResponse.status === 200 && Array.isArray(ttsResponse.data)) {
            setTtsList(ttsResponse.data);

            const updatedTTS = ttsResponse.data.find((tts) => tts.ttsid === ttsId);
            if (updatedTTS?.audio_created) {
              setIsDownloading(false);
              clearInterval(interval);
              setDownloadInterval(null);
            }
          }
        }, 30000);
        setDownloadInterval(interval);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("409")) {
        setCreationMessage("열심히 다운로드 중이에요! 잠시 후 다시 시도해주세요! 🔥");

        setTimeout(() => {
          setCreationMessage("");
        }, 3000);
      } else {
        console.error("다운로드 시작 중 에러:", error);
      }
    }
  };

  const handleImageClick = async (index: number) => {
    const selectedTTS = ttsList[index];

    try {
      const { data } = await fairyTaleApi.checkTTSCreationStatus(bookId, selectedTTS.ttsid);
      if (!data.status) {
        console.log("TTS 생성 상태: false");
        startDownloadCheck(selectedTTS.ttsid);
      } else {
        console.log("TTS 생성 상태: true");
        setSelectedIndex(index);
        setTTSId(selectedTTS.ttsid);
        setPreviousTTSId(selectedTTS.ttsid);
      }
    } catch (error) {
      console.error("TTS 생성 상태 확인 중 에러:", error);
    }
  };

  const handleClose = () => {
    setTTSId(null);
    setPreviousTTSId(null);
    if (downloadInterval) {
      clearInterval(downloadInterval);
      setDownloadInterval(null);
    }
    setIsWithoutTTSConfirmModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xl mx-4 md:w-1/2 lg:w-1/3 text-center bg-white rounded-2xl shadow-lg relative">
        <div className="px-4 py-12">
          {readAloudEnabled && (
            <>
              <button onClick={handleClose} className="absolute top-4 right-4 text-2xl font-bold">
                <img src={closebutton} alt="닫기 버튼" />
              </button>

              <WithoutTTSConfirmModal
                isOpen={isWithoutTTSConfirmModalOpen}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
              />
              <div className="text-xl font-bold">
                <span className="blue-highlight">누구 목소리</span>로 책을 읽어줄까요?
              </div>
              <p className="text-sm">아래 목록 중 하나를 선택해주세요!</p>

              {isLoading ? (
                <div className="mt-8 mb-8 flex justify-center items-center">
                  <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
                </div>
              ) : ttsList.length > 0 ? (
                <div className="mt-8 mb-8 text-lg">
                  <div className="flex flex-wrap justify-center gap-8">
                    {ttsList.map((tts, index) => (
                      <div key={index} onClick={() => handleImageClick(index)}>
                        <img
                          src={tts.image}
                          alt={tts.ttsname}
                          className={`w-28 h-28 object-cover cursor-pointer rounded-full ${
                            selectedIndex === index ? "border-[6px] border-[#67CCFF]" : ""
                          }`}
                        />
                        <p className="mt-2">{tts.ttsname}</p>
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

          <p className="text-center text-blue-500">{creationMessage}</p>
          {isReadIng ? (
            <div className="mt-8 flex gap-4 justify-center items-center">
              <button
                className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff] disabled:bg-gray-300 disabled:border-gray-300 disabled:text-white"
                onClick={() => {
                  if (onContinueReading) onContinueReading();
                }}
                disabled={readAloudEnabled && selectedIndex === null}>
                이어서 읽기
              </button>
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99] disabled:bg-gray-300 disabled:border-gray-300"
                onClick={onClose}
                disabled={readAloudEnabled && selectedIndex === null}>
                처음부터 읽기
              </button>
            </div>
          ) : (
            <div className="mt-8 text-lg">
              <button
                className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99] disabled:bg-gray-300 disabled:border-gray-300"
                onClick={onClose}
                disabled={readAloudEnabled && selectedIndex === null}>
                동화책 읽기
              </button>
            </div>
          )}
        </div>

        {/* DownloadModal 컴포넌트 사용 */}
        <DownloadingModal isOpen={isDownloading} />
      </div>
    </div>
  );
};

export default TTSChoiceModal;
