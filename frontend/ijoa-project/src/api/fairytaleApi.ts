import api from "../lib/axios";
import {
  FairyTaleRankByAgeResponse,
  FairyTaleRecommendationsResponse,
  FairyTaleByCategoryListResponse,
  FairyTaleContentResponse,
  FairyTalePageResponse,
  QuizQuestionResponse
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

  // 카테고리별 동화 리스트 조회
  getFairyTalesList: (categoryId: number, page: number) => {
    return api.get<FairyTaleByCategoryListResponse>(`/fairytales/list/${categoryId}?page=${page}`);
  },

  // 동화책 내용 조회
  getFairyTaleContents: (fairytaleId: string, pageNumber: string) => {
    return api.post<FairyTaleContentResponse>(`/fairytales/${fairytaleId}/pages/${pageNumber}`);
  },

  // 동화책 전체 페이지 조회
  getFairyTalePages: (fairytaleId: string) => {
    return api.get<FairyTalePageResponse>(`/fairytales/${fairytaleId}/pages`);
  },

  // 동화책 질문 조회
  getQuizQuestion: (pageId: number) => {
    return api.get<QuizQuestionResponse>(`/quiz/question/${pageId}`);
  },
};
