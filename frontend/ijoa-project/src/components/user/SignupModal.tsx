import React, { useState } from "react";
import Swal from "sweetalert2";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}
const SignupModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

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

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("이메일 형식을 지켜주세요!");
    }
  };

  // 이메일 전송 api 통신 함수
  const handleEmailVerification = async () => {
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
      }
    } catch (error) {
      console.log("userApi의 VerificationCodeConfirm : ", error);
    }
  };

  // 비밀번호 입력
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
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
            navigate("/parent/child/list"); // 회원가입 후 이동할 페이지
          });
        }
      } catch (error) {
        console.log("userApi의 signup : ", error);
        Swal.fire("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.", "error");
      }
    }
  };

  return (
    <div className="modal-container">
      <input
        type="email"
        placeholder="이메일을 입력해주세요"
        className="w-3/4 h-[60px] mt-6 mb-2 px-6 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={email}
        onChange={handleEmail}
      />
      {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

      {!isVerificationRequested ? (
        <button
          className="w-3/4 h-[60px] mb-2 py-3 rounded-xl font-bold bg-[#FFE0C1] hover:bg-red-200"
          onClick={handleEmailVerification}
        >
          이메일 인증요청
        </button>
      ) : (
        <div className="flex w-full items-center justify-center mb-2 gap-2">
          <input
            type="text"
            placeholder="인증번호를 입력해주세요"
            className="w-[230px] h-[60px] px-6 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isVerified} // 인증 완료 시 입력 비활성화
          />
          <button
            className={`w-[80px] h-[60px] py-3 rounded-xl font-bold ${
              isVerified ? "bg-red-300" : "bg-[#FFC890] hover:bg-red-200"
            }`}
            onClick={handleVerificationCodeConfirm}
            disabled={isVerified} // 인증 완료 시 버튼 비활성화
          >
            {isVerified ? "완료" : "확인"}
          </button>
        </div>
      )}

      <input
        type="password"
        placeholder="비밀번호를 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={password}
        onChange={handlePassword}
      />
      {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}

      <input
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={confirmPassword}
        onChange={handleConfirmPassword}
      />
      {confirmPasswordError && <p className="text-red-500 text-sm mb-4">{confirmPasswordError}</p>}

      <input
        type="text"
        placeholder="닉네임을 입력해주세요"
        className="w-3/4 h-[60px] mb-2 px-6 py-3 rounded-full bg-gray-100 border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none"
        value={nickname}
        onChange={handleNickname}
      />

      {generalError && <p className="text-red-500 font-bold text-sm mb-4">{generalError}</p>}

      <button
        onClick={handleSubmit}
        className="w-3/4 h-[60px] py-3 mb-4 rounded-full font-bold text-lg bg-orange-400 hover:bg-orange-500"
      >
        회원가입
      </button>
    </div>
  );
};

export default SignupModal;
