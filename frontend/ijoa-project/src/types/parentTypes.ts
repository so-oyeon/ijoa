// 자녀 프로필 목록 조회 응답 데이터
export interface ChildInfo {
  childId: number;
  name: string;
  gender: string;
  age: number;
  birth: string;
  profileUrl: string;
}

// 자녀 프로필 생성 요청 데이터
export interface ChildCreateInfo {
  name: string;
  birth: string;
  gender: string;
  profileImg: string;
}

// 히스토그램 집중한 시간 응답 데이터
export interface FocusTimeUnitInfo {
  unit: string;
  avgAttentionRate: number;
}

// 도넛형 차트 분류별 독서 통계 조회 응답 데이터
export interface CategoriesUnitInfo {
  category: string;
  count: number;
}

// 부모 TTS 목록 조회 응답 데이터
export interface ParentTTSInfo {
  id: number;
  name: string;
  tts: string;
  image_url: string;
}