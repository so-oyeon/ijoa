import React from "react";

interface LoginModalProps {
  openForgotPasswordModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({openForgotPasswordModal }) => {
  return (
    <>
      <input
        type="email"
        placeholder="이메일을 입력해주세요"
        className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
      />
      <input
        type="password"
        placeholder="비밀번호를 입력해주세요"
        className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
      />
      <button className="w-3/4 py-3 mb-4 font-bold bg-yellow-400 rounded-full hover:bg-yellow-500">로그인</button>
      <div className="text-right mr-5">
        <button onClick={openForgotPasswordModal} className="text-sm text-gray-500 hover:text-gray-700">
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default LoginModal;
