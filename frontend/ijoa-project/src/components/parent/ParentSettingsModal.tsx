import React, { useState } from "react";
import closebutton from "/assets/close-button.png";
import SettingsIcon from "/assets/fairytales/buttons/settings-icon.png";
import VerificationModal from "./VerificationModal";
import InformationModal from "./InformationModal";

type ModalType = "verification" | "information" | null;

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({ isOpen, onClose }) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="relative w-1/3 py-8 text-center bg-white rounded-xl shadow-lg">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-400 text-2xl">
          <img src={closebutton} alt="닫기버튼" />
        </button>

        {/* 설정 아이콘 */}
        <div className="flex justify-center items-center mb-6">
          <img src={SettingsIcon} alt="설정 아이콘" className="w-12 h-12" />
        </div>

        {/* 모달 제목 */}
        <p className="text-lg font-semibold text-gray-700 mb-6">설정을 선택해 주세요.</p>

        {/* 회원 정보 수정 버튼 */}
        <button
          className="w-3/4 mb-4 py-2 text-blue-400 font-bold rounded-full border-2 border-blue-300 hover:bg-blue-50"
          onClick={() => setModalType("verification")}
        >
          회원 정보 수정
        </button>

        {/* 로그아웃 버튼 */}
        <button
          className="w-3/4 mb-4 py-2 bg-blue-400 text-white font-bold rounded-full hover:bg-blue-500"
          onClick={() => {
            // 로그아웃 기능 추가
          }}
        >
          로그아웃
        </button>

        {/* 회원 탈퇴 버튼 */}
        <button
          className="w-3/4 py-2 bg-red-300 text-white font-bold rounded-full hover:bg-red-400"
          onClick={() => {
            // 회원 탈퇴 기능 추가
          }}
        >
          회원 탈퇴
        </button>

        {/* VerificationModal과 InformationModal의 상태 관리 */}
        {modalType === "verification" && (
          <VerificationModal
            isOpen={true}
            onClose={() => setModalType(null)}
            onNext={() => setModalType("information")}
          />
        )}
        {modalType === "information" && <InformationModal isOpen={true} onClose={() => setModalType(null)} />}
      </div>
    </div>
  );
};

export default ParentSettingsModal;
