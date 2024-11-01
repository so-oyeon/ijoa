import api from "../lib/axios";
import {
  FairyTaleRankByAgeResponse,
  FairyTaleRecommendationsResponse,
  FairyTaleByCategoryListResponse,
  FairyTalePageResponse,
} from "../types/fairytaleTypes";

export const fairyTaleApi = {
  // 나이별 인기 도서 조회
  getFairyTalesRankByAge: (age: number) => {
    return api.get<FairyTaleRankByAgeResponse>(`/fairytales/rank/${age}`);
  },

  // 사용자 맞춤 책 추천 조회
  getFairyTaleRecommendations: () => {
    return api.get<FairyTaleRecommendationsResponse>(`/fairytales/recommendations`);
  },

  // 동화 리스트 조회
  getFairyTalesList: (categoryId: number, page: number) => {
    return api.get<FairyTaleByCategoryListResponse>(`/fairytales/list/${categoryId}?page=${page}`);
  },

  getFairyTalePages: (fairytaleId: string, pageNumber: string) => {
    return api.post<FairyTalePageResponse>(`/fairytales/${fairytaleId}/pages/${pageNumber}`);
  },
};
