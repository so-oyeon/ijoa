import React, { useState } from "react";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  openForgotPasswordModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ openForgotPasswordModal }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 api 통신 함수
  const handleLogin = async () => {
    // request 데이터 객체 선언
    const data = {
      email: email,
      password: password,
    };

    // api 함수 호출
    try {
      const response = await userApi.login(data);
      // 로그인 성공 시(200)
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userType", "parent");
        navigate("/parent/child/list");
      }
    } catch (error) {
      console.log("userApi의 login : ", error);
    }
  };

  return (
    <>
      <div className="mt-4">
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          className="w-3/4 h-[60px] mb-4 px-6 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className="w-3/4 h-[60px] mb-4 px-6 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="w-3/4 h-[60px] py-3 mb-4 font-bold text-lg bg-yellow-400 rounded-full hover:bg-yellow-500"
        onClick={handleLogin}>
        로그인
      </button>
      <div className="text-right mr-8">
        <button onClick={openForgotPasswordModal} className="text-sm text-gray-500 text-[#565656]">
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default LoginModal;
