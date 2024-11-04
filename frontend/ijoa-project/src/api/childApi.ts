import api from "../lib/axios";

export const childApi = {
  // 자녀 프로필 목록 조회
  getChildList: () => {
    return api.get(`/parent/children`);
  },

  // 자녀 프로필 생성
  createChildProfile: (formData: FormData) => {
    return api.post(`/parent/children`, formData)
  },
}