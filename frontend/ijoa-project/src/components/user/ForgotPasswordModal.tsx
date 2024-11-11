import React, { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/airplane-loadingAnimation.json";

interface ForgotPasswordModalProps {
  openConfirmationModal: () => void;
  openNotFoundModal: () => void;
}

const guideText = ["새로운 비밀번호를 만들고 있어요", "이메일을 전송하고 있어요", "거의 다 됐어요"];

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ openConfirmationModal, openNotFoundModal }) => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guideIdx, setGuideIdx] = useState(0);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 입력 시 유효성 검사 및 오류 메시지 설정
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setEmailError(""); // 입력 중에는 오류 메시지 초기화

    if (inputEmail && validateEmail(inputEmail)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      setEmailError("이메일 형식을 지켜주세요!"); // 오류 메시지 설정
    }
  };

  // 비밀번호 초기화 api 통신
  const handleEmailSubmit = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setGuideIdx((prev) => (prev + 1) % guideText.length);
      }, 2000);

      // 컴포넌트 언마운트 시 인터벌 정리
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="py-10 flex flex-col justify-center items-center space-y-5">
        <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        <p className="font-semibold">{guideText[guideIdx]}</p>
      </div>
    );
  }

  return (
    <>
      <p className="font-bold text-xl mb-4">비밀번호 찾기</p>
      <p className="font-semibold">기존에 가입하신 이메일을 입력하시면, </p>
      <p className="font-semibold mb-4">비밀번호 변경 메일을 발송해드립니다.</p>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="이메일을 입력해주세요"
        className="w-3/5 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
      />
      {emailError && <p className="text-red-500 text-xs mb-4">* {emailError}</p>}
      <button
        onClick={handleEmailSubmit}
        className={`w-3/5 py-3 mb-4 font-bold rounded-full bg-[#F7EAFF] ${
          isEmailValid && !isLoading ? "active:bg-[#f0d9ff]" : "opacity-70"
        }`}
        disabled={!isEmailValid || isLoading}
      >
        비밀번호 변경 이메일 전송
      </button>
    </>
  );
};

export default ForgotPasswordModal;
