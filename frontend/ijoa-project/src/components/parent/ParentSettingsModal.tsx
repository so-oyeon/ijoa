import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import closebutton from "/assets/close-button.png";
import SettingsIcon from "/assets/fairytales/buttons/settings-icon.png";
import VerificationModal from "./VerificationModal";
import InformationModal from "./InformationModal";
import DeleteInformationModal from "./DeleteInformationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { userApi } from "../../api/userApi";

type ModalType = "main" | "verification" | "information" | "deleteinformation" | "confirmation";

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({ isOpen, onClose }) => {
  const [modalType, setModalType] = useState<ModalType>("main");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await userApi.logout();
      if (response.status === 200) {
        localStorage.clear();
      }
      Swal.fire({
        icon: "success",
        title: "로그아웃이 완료되었습니다",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="relative w-1/3 py-8 text-center bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-400 text-2xl">
          <img src={closebutton} alt="닫기버튼" />
        </button>

        {/* 설정 아이콘 */}
        <div className="mt-4 flex justify-center items-center mb-6">
          <img src={SettingsIcon} alt="설정 아이콘" className="w-12 h-12" />
        </div>

        {/* 모달 내용 전환 */}
        {modalType === "main" && (
          <>
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
              <button
                className="w-1/2 h-[60px] py-2 bg-[#FF8067] text-white font-bold text-lg rounded-full hover:bg-red-400"
                onClick={() => setModalType("deleteinformation")}
              >
                회원 탈퇴
              </button>
            </div>
          </>
        )}

        {/* VerificationModal 표시 */}
        {modalType === "verification" && (
          <VerificationModal
            isOpen={true}
            onClose={() => setModalType("main")}
            onNext={() => setModalType("information")}
          />
        )}

        {/* InformationModal 표시 */}
        {modalType === "information" && <InformationModal isOpen={true} onClose={() => setModalType("main")} />}

        {/* DeleteInformationModal 호출 */}
        {modalType === "deleteinformation" && (
          <DeleteInformationModal
            isOpen={true}
            onClose={() => setModalType("main")}
            onNext={() => setModalType("confirmation")}
          />
        )}

        {/* ConfirmationModal 표시 */}
        {modalType === "confirmation" && <DeleteConfirmationModal isOpen={true} onClose={() => setModalType("main")} />}
      </div>
    </div>
  );
};

export default ParentSettingsModal;
