// 로그인
export interface LoginUserInfo {
  email: string;
  password: string;
}

// 이메일 인증
export interface VerifyCode{
  email : string;
  authCode : string;
}

// 회원가입
export interface SignupUserInfo {
  email : string;
  password : string;
  nickname : string;
}