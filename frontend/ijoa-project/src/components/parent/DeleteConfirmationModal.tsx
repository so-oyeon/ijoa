import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import Attention from "/assets/fairytales/buttons/attention.png";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const confirmDeleteAccount = async () => {
    try {
      const response = await userApi.deleteUserInfo();
      if (response.status === 200) {
        localStorage.clear();
        Swal.fire({
          icon: "success",
          title: "회원 탈퇴가 완료되었습니다",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/home");
        });
      } else {
        throw new Error("회원 탈퇴 실패");
      }
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-1/3 py-6 bg-white rounded-2xl text-center">
        <div className="flex justify-center">
          <img src={Attention} alt="주의 아이콘" className="w-36" />
        </div>
        <div className="text-xl font-bold text-gray-700 mb-4">회원 탈퇴</div>
        <p className="text-gray-600 font-semibold mb-6 whitespace-pre-line">
          {"정말로 회원 탈퇴를 진행하시겠습니까?\n이 작업은 되돌릴 수 없습니다."}
        </p>
        <div className="flex justify-center gap-5">
          <button
            className="w-1/3 h-[60px] py-2 bg-gray-300 text-lg text-gray-700 rounded-full font-bold hover:bg-gray-400"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="w-1/3 h-[60px] py-2 bg-red-500 text-lg text-white rounded-full font-bold hover:bg-red-700 mb-4"
            onClick={confirmDeleteAccount}
          >
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
