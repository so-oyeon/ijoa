import api from "../lib/axios";
import { LoginUserInfo, VerifyCode, SignupUserInfo  } from "../types/userTypes";

export const userApi = {
  // 로그인
  login: (userInfo: LoginUserInfo) => {
    return api.post(`/auth/login`, userInfo);
  },

  // 로그아웃
  logout: () => {
    return api.post(`/auth/logout`);
  },

  // 이메일 인증 코드 전송
  sendVerificationCode: (email: string) => {
    return api.post(`/auth/email/verify-code/send?email=${email}`);
  },

  // 이메일 인증 코드 확인
  confirmVerificationCode: (code: VerifyCode) => {
    return api.post(`/auth/email/verify-code/confirm`, code);
  },

  // 회원가입
  signup : (userInfo : SignupUserInfo) => {
    return api.post(`/user/signup`, userInfo);
  },
  
  // 자녀 프로필로 전환
  switchChild: (childId: number) => {
    return api.patch(`/auth/switch-child/${childId}`);
  },
};
