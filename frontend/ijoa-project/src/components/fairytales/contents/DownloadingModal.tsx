import React from "react";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/download-loadingAnimation.json";
import { useNavigate } from "react-router-dom";

interface DownloadingModalProps {
  isOpen: boolean;
}

const DownloadingModal: React.FC<DownloadingModalProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const toHome = () => {
    navigate("/child/fairytale/list");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[80%] sm:w-[400px] flex flex-col justify-center items-center">
        <Lottie className="w-40 aspect-1 mb-4" loop play animationData={loadingAnimation} />
        <div className="text-black text-md font-bold whitespace-pre-line text-center mb-6">
          {
            "다운로드 중입니다. 잠시만 기다려주세요...\n이 페이지에서 나가도\n다운로드는 정상적으로 진행됩니다.\n(*약 1~2분 소요)"
          }
        </div>
        <button
          className="px-6 sm:px-8 py-2 text-white text-base sm:text-lg font-bold bg-[#67CCFF] rounded-2xl border-2 border-[#67CCFF] active:bg-[#005f99]"
          onClick={toHome}
        >
          메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default DownloadingModal;
