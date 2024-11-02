import api from "../lib/axios";
import { LoginUserInfo, VerifyCode, SignupUserInfo, PatchUserInfo, UserInfo } from "../types/userTypes";

export const userApi = {
  // 로그인
  login: (userInfo: LoginUserInfo) => {
    return api.post(`/auth/login`, userInfo);
  },

  // 로그아웃
  logout: () => {
    return api.post(`/auth/logout`);
  },

  // 비밀번호 검증
  verifyPassword: (password: string) => {
    return api.post(`/auth/verify-password`, { password });
  },

  // 비밀번호 초기화
  resetPassword: (email: string) => {
    return api.patch(`/user/reset-password/${email}`);
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
  signup: (userInfo: SignupUserInfo) => {
    return api.post(`/user/signup`, userInfo);
  },

  // 자녀 프로필로 전환
  switchChild: (childId: number) => {
    return api.patch(`/auth/switch-child/${childId}`);
  },

  // 회원 정보 수정
  patchUserInfo: (userInfo: PatchUserInfo) => {
    return api.patch(`/user`, userInfo);
  },

  // 사용자 정보 가져오기
  getUserInfo: () => {
    return api.get<UserInfo>(`/user`);
  }
};

