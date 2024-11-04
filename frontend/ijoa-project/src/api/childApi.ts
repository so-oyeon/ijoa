import api from "../lib/axios";

export const childApi = {
  getChildList: () => {
    return api.get(`/parent/children`);
  },
}