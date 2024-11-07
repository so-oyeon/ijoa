import api from "../lib/axios";
import { ChildInfo, TTSFileStorageUrlInfo } from "../types/parentTypes"
import { VoiceAlbumDateRange } from "../types/voiceAlbumTypes";

export const parentApi = {
  // 자녀 프로필 목록 조회
  getChildProfileList: () => {
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

  // 히스토그램 집중한 시간 차트 조회
  getFocusTimeData: (childId: number, interval: string) => {
    return api.get(`/children/${childId}/statistics/focus-time`, { params: { interval } });
  },

  // 도넛형 차트 분류별 독서 통계 조회
  getCategoriesData: (childId: number) => {
    return api.get(`/children/${childId}/statistics/categories`);
  },

  // 독서 분석 보고서 조회
  getReadingReport: (childId: number) => {
    return api.get(`/children/${childId}/statistics/reading-report`);
  },

  // TTS 목록 조회
  getParentTTSList: () => {
    return api.get(`/tts/profile`);
  },

  // TTS 녹음 스크립트 목록 조회
  getTTSScriptList: () => {
    return api.get(`/tts/script`);
  },

  // TTS 프로필 생성
  createTTSProfile: (formData: FormData) => {
    return api.post(`/tts/profile`, formData);
  },

  // TTS 학습용 음성 파일 저장 s3 url 목록 조회
  getTTSFileStorageUrlList: (ttsId: number, data: TTSFileStorageUrlInfo) => {
    return api.post(`/tts/train/${ttsId}`, data);
  },

  // 음성 앨범 답변한 책 목록 조회
  getVoiceAlbumBookList: (childId: number, page: number, data: VoiceAlbumDateRange) => {
    return api.post(`/quiz/answer/list/${childId}?page=${page}`, data);
  },

  // 음성 앨범 답변한 책 상세 조회
  getVoiceAlbumBookDetail: (childId: string, bookId: string) => {
    return api.get(`/quiz/answer/${childId}/${bookId}`);
  },
};
