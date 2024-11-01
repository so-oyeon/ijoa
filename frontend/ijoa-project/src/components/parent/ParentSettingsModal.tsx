import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import closebutton from "/assets/close-button.png";
import SettingsIcon from "/assets/fairytales/buttons/settings-icon.png";
import VerificationModal from "./VerificationModal";
import InformationModal from "./InformationModal";
import DeleteInformationModal from "./DeleteInformationModal";
import { userApi } from "../../api/userApi";

type ModalType = "verification" | "information" | "deleteConfirmation" | null;

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({ isOpen, onClose }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const navigate = useNavigate();

  // 로그아웃 api 통신 함수
  const handleLogout = async () => {
    try {
      const response = await userApi.logout();
      // 로그아웃 성공 시(200)
      if (response.status === 200) {
        localStorage.clear(); // sessionStorage에 저장된 모든 데이터 삭제
      }
      Swal.fire({
        icon: "success",
        title: "로그아웃이 완료되었습니다",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      console.log("userApi의 logout : ", error);
      Swal.fire({
        icon: "error",
        title: "로그아웃 실패",
        text: "다시 시도해 주세요.",
        confirmButtonText: "확인",
      });
    }
  };
  // 회원탈퇴 모달
  const handleDeleteAccount = () => {
    setModalType("deleteConfirmation");
  };
  // 회원탈퇴 통신 연결
  const confirmDeleteAccount = async () => {
    try {
      await fetch("/api/delete-account", {
        method: "DELETE",
        credentials: "include",
      });
      localStorage.removeItem("authToken");
      sessionStorage.clear();

      Swal.fire({
        icon: "success",
        title: "회원 탈퇴가 완료되었습니다",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      Swal.fire({
        icon: "error",
        title: "회원 탈퇴 실패",
        text: "다시 시도해 주세요.",
        confirmButtonText: "확인",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="relative w-1/3 py-8 text-center bg-white rounded-xl shadow-lg">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-400 text-2xl">
          <img src={closebutton} alt="닫기버튼" />
        </button>

        {/* 설정 아이콘 */}
        <div className="mt-4 flex justify-center items-center mb-6">
          <img src={SettingsIcon} alt="설정 아이콘" className="w-12 h-12" />
        </div>

        {/* 모달 제목 */}
        <p className="text-lg font-semibold text-gray-700 mb-6">설정을 선택해 주세요.</p>

        <div className="flex flex-col justify-center items-center">
          {/* 회원 정보 수정 버튼 */}
          <button
            className="w-1/2 h-[60px] mb-4 py-2 text-[#67CCFF] font-bold text-lg rounded-full border-2 border-[#67CCFF] hover:bg-blue-50"
            onClick={() => setModalType("verification")}
          >
            회원 정보 수정
          </button>

          {/* 로그아웃 버튼 */}
          <button
            className="w-1/2 h-[60px] mb-4 py-2 bg-[#67CCFF] text-white text-lg font-bold rounded-full hover:bg-blue-500"
            onClick={handleLogout}
          >
            로그아웃
          </button>

          {/* 회원 탈퇴 버튼 */}
          <button
            className="w-1/2 h-[60px] py-2 bg-[#FF8067] text-white font-bold text-lg rounded-full hover:bg-red-400"
            onClick={handleDeleteAccount}
          >
            회원 탈퇴
          </button>
        </div>

        {/* VerificationModal과 InformationModal의 상태 관리 */}
        {modalType === "verification" && (
          <VerificationModal
            isOpen={true}
            onClose={() => setModalType(null)}
            onNext={() => setModalType("information")}
          />
        )}
        {modalType === "information" && <InformationModal isOpen={true} onClose={() => setModalType(null)} />}
        {modalType === "deleteConfirmation" && (
          <DeleteInformationModal isOpen={true} onClose={() => setModalType(null)} onConfirm={confirmDeleteAccount} />
        )}
      </div>
    </div>
  );
};

export default ParentSettingsModal;
