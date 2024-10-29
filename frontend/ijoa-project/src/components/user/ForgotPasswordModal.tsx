import React, { useState } from "react";
import axios from "axios";

interface ForgotPasswordModalProps {
  openConfirmationModal: () => void;
  openNotFoundModal: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ openConfirmationModal, openNotFoundModal }) => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.get(`http://k11d105.p.ssafy.io:8080/api/v1/user/check-email/${email}`);

      if (response.status === 200) {
        openNotFoundModal(); // DB에 없는 이메일일 경우
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          openConfirmationModal(); // DB에 있는 이메일일 경우
        } else {
          console.error("서버 요청 오류:", error);
          openNotFoundModal();
        }
      } else {
        console.error("알 수 없는 오류:", error);
      }
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
