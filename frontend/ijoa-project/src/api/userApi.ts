import api from "../lib/axios";
import { LoginUserInfo } from "../types/userTypes";

export const userApi = {
  // 로그인
  login: (userInfo: LoginUserInfo) => {
    return api.post(`/auth/login`, userInfo);
  },

  // 자녀 프로필로 전환
  switchChild: (childId: number) => {
    return api.patch(`/auth/switch-child/${childId}`);
  },
}