import api from "../lib/axios";
import { ChildInfo } from "../types/childTypes"

export const childApi = {
  // 자녀 프로필 목록 조회
  getChildList: () => {
    return api.get(`/parent/children`);
  },

  // 자녀 프로필 생성
  createChildProfile: (formData: FormData) => {
    return api.post(`/parent/children`, formData);
  },

  // 자녀 프로필 수정
  updateChildProfile: (childId: number, formData: FormData) => {
    return api.patch(`/parent/children/${childId}`, formData);
  },

  // 자녀 프로필 삭제
  deleteChildProfile: (childId: number) => {
    return api.delete(`/parent/children/${childId}`);
  },

  // 자녀 프로필 단건 조회
  getChildProfile: (childId: number) => {
    return api.get<ChildInfo>(`/parent/children/${childId}`);
  },
};
