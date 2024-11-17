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

// 독서 분석 보고서 조회 응답 데이터
export interface ReadingReportInfo {
  gazeDistributionAnalysis: string;
  timeOfDayAttentionAnalysis: string;
  textLengthAnalysis: string;
  conclusion: string;
}

// 집중한 단어 타이포그래피 조회 응답 데이터
export interface TypographyData {
  word: string;
  focusCount: number;
}

// 부모 TTS 목록 조회 응답 데이터
export interface ParentTTSInfo {
  id: number;
  name: string;
  tts: string;
  image_url: string;
  trainData: boolean;
}

// TTS 학습 스크립트 목록 조회 응답 데이터
export interface TTSScriptInfo {
  id: number;
  script: string;
}

// TTS 프로필 생성 요청 데이터
export interface TTSProfileInfo {
  name: string;
  image: string;
}

// TTS 학습용 음성 파일 저장 s3 url 요청 데이터
export interface TTSFileStorageUrlInfo {
  fileScriptPairs: AudioFileInfo[];
}

export interface AudioFileInfo {
  fileName: string;
  scriptId: number;
}

// TTS 학습용 음성 파일 저장 s3 url 응답 데이터
export interface S3UrlInfo {
  key: string;
  url: string;
}