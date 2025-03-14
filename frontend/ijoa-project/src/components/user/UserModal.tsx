import React from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ConfirmationModal from "./ConfirmationModal";
import NotFoundModal from "./NotFoundModal";
import closebutton from "/assets/close-button.png";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "login" | "signup" | "forgotPassword" | "confirmation" | "notFound" | null;
  openForgotPasswordModal: () => void;
  openConfirmationModal: () => void;
  openNotFoundModal: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  modalType,
  openForgotPasswordModal,
  openConfirmationModal,
  openNotFoundModal,
}) => {
  if (!isOpen || !modalType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative w-1/3 sm:h-3/4 lg:h-auto py-8 text-center bg-white rounded-2xl shadow-lg overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4">
          <img src={closebutton} alt="Close" />
        </button>

        {/* 모달 타입에 따라 해당 모달 컴포넌트 렌더링 */}
        {modalType === "login" && <LoginModal openForgotPasswordModal={openForgotPasswordModal} />}
        {modalType === "signup" && <SignupModal onClose={onClose} />}
        {modalType === "forgotPassword" && (
          <ForgotPasswordModal openConfirmationModal={openConfirmationModal} openNotFoundModal={openNotFoundModal} />
        )}
        {modalType === "confirmation" && <ConfirmationModal onClose={onClose} />}
        {modalType === "notFound" && <NotFoundModal onClose={onClose} />}
      </div>
    </div>
  );
};
export default UserModal;
