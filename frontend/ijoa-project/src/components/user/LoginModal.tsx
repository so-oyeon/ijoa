import React, { useState, useRef } from "react";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

interface LoginModalProps {
  openForgotPasswordModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ openForgotPasswordModal }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await userApi.login(data);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userType", "parent");
        // 로그인할때 어짜피 데이터들이 넘어오니까 이걸 토대로 tutorialComplted가 true인지 false인지 확인.
        navigate("/parent/child/list");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "비밀번호가 잘못되었습니다.",
            confirmButtonColor: "#67CCFF",
          });
        } else if (error.response?.status === 404) {
          Swal.fire({
            icon: "error",
            title: "계정 없음",
            text: "존재하지 않는 계정입니다.",
            confirmButtonColor: "#3085d6",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "다시 시도해주세요.",
            confirmButtonColor: "#3085d6",
          });
        }
      }
      console.log("userApi의 login 에러: ", error);
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      loginButtonRef.current?.click();
    }
  };

  return (
    <>
      <div className="mt-4">
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          className="w-[25vw] h-[50px] md:w-[25vw] md:h-[50px] lg:w-[25vw] lg:h-[60px] mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className="w-[25vw] h-[50px] md:w-[25vw] md:h-[50px] lg:w-[25vw] lg:h-[60px] mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeyDown}
        />
      </div>
      <button
        className="w-[25vw] h-[50px] md:w-[25vw] md:h-[50px] lg:w-[25vw] lg:h-[60px]  py-3 mb-4 font-bold text-base md:text-lg lg:text-xl bg-yellow-400 rounded-full active:bg-yellow-500"
        onClick={handleLogin}
        ref={loginButtonRef}
      >
        로그인
      </button>
      <div className="text-right mr-8">
        <button onClick={openForgotPasswordModal} className="text-sm md:text-base text-[#565656]">
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default LoginModal;
