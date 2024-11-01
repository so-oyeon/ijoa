import api from "../lib/axios";
import { LoginUserInfo } from "../types/userTypes";

export const userApi = {
  // 로그인
  login: (userInfo: LoginUserInfo) => {
    return api.post(`/auth/login`, userInfo);
  },
}