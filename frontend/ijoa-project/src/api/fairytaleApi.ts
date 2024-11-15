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
  ChildrenTTSListResponse,
  TTSPlaybackResponse,
  TTSAudioBookResponse,
  EyeTrackingRequestData
} from "../types/fairytaleTypes";

export const fairyTaleApi = {
  // 나이별 인기 도서 조회
  getFairyTalesRankByAge: () => {
    return api.get<FairyTaleRankByAgeResponse>(`/fairytales/rank`);
  },

  // 사용자 맞춤 책 추천 조회
  getFairyTaleRecommendations: (page: number, size: number) => {
    return api.get<FairyTaleRecommendationsResponse>(`/fairytales/recommendations?page=${page}&size=${size}`);
  },

  // 카테고리별 동화 리스트 조회
  getFairyTalesListByCategory: (category: string, page: number, size: number) => {
    return api.get<FairyTaleByCategoryListResponse>(`/fairytales/list/${category}?page=${page}&size=${size}`);
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
  getQuizQuestion: (bookId: number, pageNum: number) => {
    return api.get<QuizQuestionResponse>(`/quiz/question/${bookId}/${pageNum}`);
  },

  // 동화 제목 검색 조회
  getFairyTalesBySearch: (title: string, page: number, size: number) => {
    return api.get<FairyTaleSearchResponse>(`/fairytales/search?title=${title}&page=${page}&size=${size}`);
  },

  // 동화책 퀴즈 답변 조회
  getFairytaleQuizAnswer: (childrenId: number, fairytaleId: number, page: number) => {
    return api.get<FairytaleQuizAnswerResponse>(`/quiz/answer/${childrenId}/${fairytaleId}`, {
      params: { page },
    });
  },

  // 읽은 책과 읽고 있는 책 목록 조회
  getFairytalesReadList: (page: number, size: number) => {
    return api.get<FairyTaleReadCheckResponse>(`/fairytales/children?page=${page}&size=${size}`);
  },

  // 전체 동화책 목록 조회
  getFairyTalesList: (page: number, size: number) => {
    return api.get<FairyTaleListResponse>(`/fairytales/list?page=${page}&size=${size}`);
  },

  // 퀴즈 답변 저장
  submitQuizAnswer: (childId: number, quizId: number, fileName: string) => {
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

  // TTS 낭독
  getTTSPlayback: (ttsId: number, bookId: number, page: number) => {
    return api.get<TTSPlaybackResponse>(`/tts/audios/${ttsId}/${bookId}`, {
      params: { page },
    });
  },

  // 동화책 TTS 생성
  getTTSAudioBook: (bookId: number, TTSId: number) => {
    return api.get<TTSAudioBookResponse>(`/tts/audio-book/${bookId}/${TTSId}`);
  },

  // 동화책 특정 페이지 시선추적 데이터 저장
  createEyeTrackingData: (pageHistoryId: number, data: EyeTrackingRequestData) => {
    return api.post(`/fairytales/reading-histories/${pageHistoryId}/eye-tracking`, data);
  },
};
