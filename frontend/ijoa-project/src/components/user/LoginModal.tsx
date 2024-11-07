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

  // 로그인 버튼에 대한 Ref 생성
  const loginButtonRef = useRef<HTMLButtonElement>(null);

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
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userType", "parent");
        navigate("/parent/child/list");
      }
    } catch (error) {
      // error가 AxiosError 타입인지 확인
      if (axios.isAxiosError(error)) {
        // 오류의 상태 코드에 따라 알림을 표시
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

  // 비밀번호 필드에서 Enter 키를 눌렀을 때 로그인 버튼 클릭되게하는 함수
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
          onKeyDown={handlePasswordKeyDown}
        />
      </div>
      <button
        className="w-3/4 h-[60px] py-3 mb-4 font-bold text-lg bg-yellow-400 rounded-full hover:bg-yellow-500"
        onClick={handleLogin}
        ref={loginButtonRef}
      >
        로그인
      </button>
      <div className="text-right mr-8">
        <button onClick={openForgotPasswordModal} className="text-sm text-[#565656]">
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default LoginModal;
