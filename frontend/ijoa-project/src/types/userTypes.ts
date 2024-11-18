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

// 회원 정보 수정
export interface PatchUserInfo {
  nickname : string;
  password : string;
}
  // 사용자 정보 가져오기
export interface UserInfo {
  email: string;
  nickname: string;
}