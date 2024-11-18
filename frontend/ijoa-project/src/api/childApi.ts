import api from "../lib/axios";
import { ChildLevelResponse } from "../types/childTypes";

export const childApi = {
  // 자녀 독서 레벨 조회
  getLevel: () => {
    return api.get<ChildLevelResponse>(`/children/level`);
  },
};