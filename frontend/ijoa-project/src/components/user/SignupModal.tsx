import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { userApi } from "../../api/userApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/airplane-loadingAnimation.json";

interface Props {
  onClose: () => void;
}

const guideText = ["인증번호를 생성하고 있어요", "이메일을 전송하고 있어요", "거의 다 됐어요"];

const SignupModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guideIdx, setGuideIdx] = useState(0);

  const isFormValid =
    email && password && confirmPassword && nickname && !emailError && !confirmPasswordError && isVerified;

  // 유효한 이메일인지 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 검사 및 오류 내용 반환
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");

    if (newEmail && validateEmail(newEmail)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      setEmailError("이메일 형식을 지켜주세요!");
    }
  };

  // 이메일 전송 api 통신 함수
  const handleEmailVerification = async () => {
    setIsLoading(true);
    // api 함수 호출
    try {
      const response = await userApi.sendVerificationCode(email);
      // 이메일 인증 성공 시(201)
      console.log(response);
      if (response.status === 201) {
        setIsVerificationRequested(true);
      }
    } catch (error) {
      console.log("userApi의 sendVerificationCode : ", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 인증 코드 확인 api 통신 함수
  const handleVerificationCodeConfirm = async () => {
    // request 객체 선언
    const data = {
      email: email,
      authCode: verificationCode,
    };
    //api함수 호출
    try {
      const response = await userApi.confirmVerificationCode(data);
      // 인증코드 성공 시(200)
      console.log(response);
      if (response.status === 200) {
        setIsVerified(true);
        Swal.fire("인증 성공", "인증이 완료되었습니다.", "success");
      }
    } catch (error) {
      console.log("userApi의 VerificationCodeConfirm : ", error);
      Swal.fire("인증 실패", "인증 코드가 잘못되었습니다. 다시 확인해 주세요.", "error");
    }
  };

  // 비밀번호 확인 및 불일치 시 오류 반환
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError("");

    if (newConfirmPassword && newConfirmPassword !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다!");
    }
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 및 유효성 검사
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");

    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError("최소 8자 이상, 영문 및 숫자를 포함");
    } else {
      setPasswordError(""); // 유효할 경우 에러 메시지 초기화
    }
  };

  // 닉네임 설정
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 회원가입 api 통신 함수
  const handleSubmit = async () => {
    // 입력 필드 유효성 검사
    if (!email || !password || !confirmPassword || !nickname) {
      setGeneralError("필수 정보란을 다 입력해주세요!");
    } else if (!validateEmail(email)) {
      setEmailError("이메일 형식을 지켜주세요!");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다!");
    } else {
      setGeneralError("");

      // 회원가입 요청 데이터 객체 생성
      const data = {
        email: email,
        password: password,
        nickname: nickname,
      };

      // API 호출
      try {
        const response = await userApi.signup(data);

        // 회원가입 성공 시(201)
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "회원가입이 완료되었습니다.",
            confirmButtonText: "확인",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            onClose();
          });
        }
      } catch (error) {
        console.log("userApi의 signup : ", error);
        Swal.fire("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.", "error");
      }
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
    <div className="modal-container">
      {/* 이메일 입력 필드 및 오류 표시 */}
      <input
        type="email"
        placeholder="이메일을 입력해주세요"
        className="w-3/4 h-[60px] mt-6 mb-2 px-6 py-3 rounded-full bg-gray-100 text-gray-500 border border-gray-300 placeholder-gray-400 focus:outline-none"
        value={email}
        onChange={handleEmail}
      />
      {emailError && <p className="text-red-500 text-xs mb-4">* {emailError}</p>}

      {/* 이메일 인증 요청 버튼 - 이메일 형식이 유효할 때만 활성화 */}
      {!isVerificationRequested ? (
        <button
          className={`w-3/4 h-[60px] mb-2 py-3 rounded-xl font-bold bg-[#FFE0C1] ${
            !isEmailValid || isLoading ? "bg-orange-200 opacity-70" : "active:bg-red-200"
          }`}
          onClick={handleEmailVerification}
          disabled={!isEmailValid || isLoading} // 이메일이 유효하고 로딩 중이 아닐 때만 활성화
        >
          {isLoading ? (
            <div className="flex justify-center">
              <div className="loader"></div>
            </div>
          ) : (
            "이메일 인증요청"
          )}
        </button>
      ) : (
        <div className="flex w-full h-[60px] items-center justify-center mb-2 gap-2">
          <input
            type="text"
            placeholder="인증번호 입력"
            className="w-[200px] h-[60px] px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isVerified} // 인증 완료 시 입력 비활성화
          />
          <button
            className={`w-[60px] h-[50px] py-3 rounded-xl font-bold ${
              isVerified ? "bg-gray-400 text-white" : "bg-[#FFC890] active:bg-red-200"
            }`}
            onClick={handleVerificationCodeConfirm}
            disabled={isVerified} // 인증 완료 시 버튼 비활성화
          >
            {isVerified ? "완료" : "확인"}
          </button>
          <button
            className={`w-[80px] h-[50px] py-2 rounded-xl font-bold ${
              isVerified ? "bg-gray-400 text-white" : "bg-blue-200 active:bg-blue-300"
            }`}
            onClick={handleEmailVerification}
            disabled={isLoading || isVerified}
          >
            재전송
          </button>
        </div>
      )}

      {/* 비밀번호 입력 및 오류 표시 */}

      <input
        type="password"
        placeholder="비밀번호를 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={password}
        onChange={handlePassword}
      />
      {passwordError && <p className="text-red-500 text-xs mb-4">* {passwordError}</p>}

      <input
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={confirmPassword}
        onChange={handleConfirmPassword}
      />
      {confirmPasswordError && <p className="text-red-500 text-xs mb-4">* {confirmPasswordError}</p>}

      <input
        type="text"
        placeholder="닉네임을 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={nickname}
        onChange={handleNickname}
      />

      {generalError && <p className="text-red-500 font-bold text-xs mb-4">* {generalError}</p>}

      <button
        onClick={handleSubmit}
        className={`w-3/4 h-[60px] py-3 mb-4 rounded-full font-bold text-lg ${
          isFormValid ? "bg-orange-400 active:bg-orange-500" : "bg-orange-200 opacity-70"
        }`}
        disabled={!isFormValid} // 이메일 인증 완료 전까지 비활성화
      >
        회원가입
      </button>
    </div>
  );
};

export default SignupModal;
