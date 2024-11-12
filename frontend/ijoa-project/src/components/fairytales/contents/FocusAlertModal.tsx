import React from "react";
import { motion } from "framer-motion"; // Framer Motion import
import Attention from "/assets/fairytales/buttons/attention.png";
import SideLion from "/assets/fairytales/images/side-lion.png";
import SideFrog from "/assets/fairytales/images/side-frog.png";

interface FocusAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FocusAlertModal: React.FC<FocusAlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="relative w-full h-[350px] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-center bg-white rounded-2xl shadow-lg mx-4">
        <div className="pt-3">
          <div className="flex justify-center items-center">
            <img src={Attention} alt="집중 아이콘" className="w-20 sm:w-32 md:w-36 absolute top-2" />
          </div>
          <div className="flex justify-center items-center mt-12 sm:mt-14">
            {/* 사자 이미지에 애니메이션 적용 */}
            <motion.img
              src={SideLion}
              alt="사자"
              className="hidden sm:block w-24 sm:w-28 md:w-36 h-auto"
              animate={{ y: ["0%", "-10%", "0%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex flex-col items-center justify-center mt-20 h-full">
              <p className="text-md sm:text-md lg:text-xl font-semibold whitespace-pre-line text-center">
                {"집중력이 떨어지고 있어요😅\n잠깐 스트레칭하고 올까요?"}
              </p>
            </div>
            {/* 개구리 이미지에 애니메이션 적용, sm 이하에서 숨김 */}
            <motion.img
              src={SideFrog}
              alt="개구리"
              className="hidden sm:block w-24 sm:w-28 md:w-36 h-auto"
              animate={{ y: ["0%", "10%", "0%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <button
            onClick={onClose}
            className="mt-4 sm:mt-6 absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 sm:w-28 py-2 text-white text-base sm:text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusAlertModal;
