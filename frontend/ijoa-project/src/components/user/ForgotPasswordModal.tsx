import React, { useState } from "react";
import { userApi } from "../../api/userApi";

interface ForgotPasswordModalProps {
  openConfirmationModal: () => void;
  openNotFoundModal: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ openConfirmationModal, openNotFoundModal }) => {
  const [email, setEmail] = useState("");

  // 비밀번호 초기화 api 통신
  const handleEmailSubmit = async () => {
    // api 함수 호출
    try {
      const response = await userApi.resetPassword(email);
      // 이메일 전송 성공 시(200)
      if (response.status === 200) {
        openConfirmationModal();
      }
    } catch (error) {
      openNotFoundModal();
      console.log("userApi의 resetPassword : ", error);
    }
  };

  return (
    <>
      <p className="font-bold text-xl mb-4">비밀번호 찾기</p>
      <p className="font-semibold">기존에 가입하신 이메일을 입력하시면, </p>
      <p className="font-semibold mb-4">비밀번호 변경 메일을 발송해드립니다.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력해주세요"
        className="w-3/5 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={handleEmailSubmit}
        className="w-3/5 py-3 mb-4 font-bold bg-[#F7EAFF] rounded-full hover:bg-[#f0d9ff]"
      >
        비밀번호 변경 이메일 전송
      </button>
    </>
  );
};

export default ForgotPasswordModal;
