import api from "../lib/axios";
import {
  FairyTaleRankByAgeResponse,
  FairyTaleRecommendationsResponse,
  FairyTaleByCategoryListResponse,
  FairyTaleContentResponse,
  FairyTalePageResponse,
  QuizQuestionResponse,
  FairyTaleSearchResponse,
  FairytaleQuizAnswerResponse,
  FairyTaleReadCheckResponse,
  FairyTaleListResponse,
  QuizAnswerResponse,
  ChildrenTTSListResponse
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
  getFairyTalesListByCategory: (categoryId: number, page: number) => {
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

  // 동화 제목 검색 조회
  getFairyTalesBySearch: (word: string, page: number) => {
    return api.get<FairyTaleSearchResponse>(`/fairytales/search`, {
      params: { word, page },
    });
  },

  // 동화책 퀴즈 답변 조회
  getFairytaleQuizAnswer: (childrenId: number, fairytaleId: number, page: number) => {
    return api.get<FairytaleQuizAnswerResponse>(`/quiz/answer/${childrenId}/${fairytaleId}`, {
      params: { page },
    });
  },

  // 읽은 책과 읽고 있는 책 목록 조회
  getFairytalesReadList: (page: number) => {
    return api.get<FairyTaleReadCheckResponse>(`/fairytales/children`, {
      params: { page },
    });
  },

  // 전체 동화책 목록 조회
  getFairyTalesList: (page: number, size: number) => {
    return api.get<FairyTaleListResponse>(`/fairytales/list`, {
      params: { page, size },
    });
  },

  // 퀴즈 답변 저장
  submitQuizAnswer: (childId: number, quizId: number, fileName: number) => {
    return api.post<QuizAnswerResponse>(`/quiz/answer`, {
      childId,
      quizId,
      fileName,
    });
  },

  // 자녀 TTS 목록 조회
  getChildrenTTSList: (bookId: number) => {
    return api.get<ChildrenTTSListResponse[]>(`/tts/audios/${bookId}`);
  },
};
