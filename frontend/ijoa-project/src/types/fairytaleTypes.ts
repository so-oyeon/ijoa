// 나이별 동화 랭킹
export interface FairyTaleRankByAgeItem {
  fairytaleId: number;
  title: string;
  image: string;
  total_pages: number;
  current_page: number;
  is_completed: boolean;
}

export interface FairyTaleRankByAgeResponse {
  rankList: FairyTaleRankByAgeItem[];
}

// 사용자 맞춤 책 추천
export interface FairyTaleRecommendationItem {
  fairytaleId: number;
  title: string;
  image: string;
  total_pages: number;
  current_page: number;
  is_completed: boolean;
}

export type FairyTaleRecommendationsResponse = FairyTaleRecommendationItem[];

// 카테고리별 동화 리스트 조회
export interface FairyTaleByCategoryItem {
  fairytaleId: number;
  title: string;
  image: string;
  total_pages: number;
  current_page: number;
  is_completed: boolean;
}

export interface FairyTaleByCategoryListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: FairyTaleByCategoryItem[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 동화 내용 조회 (POST)
export interface FairyTaleContentResponse {
  pageNumber: number;
  content: string;
  image: string;
  totalPages: number;
  pageHistoryId: number;
}

// 동화 전체 페이지 조회
export interface FairyTalePageResponse {
  pageNumber: number;
  image: string;
}

// 동화 질문 조회
export interface QuizQuestionResponse {
  quizId: number;
  text: string;
}

// 동화 제목 검색 조회
export interface FairyTaleSearchItem {
  fairytaleId: number;
  title: string;
  image: string;
  total_pages: number;
  current_page: number;
  is_completed: boolean;
}

export interface FairyTaleSearchResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: FairyTaleSearchItem[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 동화책 퀴즈 답변 조회
export interface FairytaleQuizAnswerItem {
  answerId: number;
  fairytaleId: number;
  quizId: number;
  text: string;
  image: string;
  answer: string;
}

export interface FairytaleQuizAnswerResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: FairytaleQuizAnswerItem[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 전체 동화책 목록 조회
export interface FairyTaleListItem {
  fairytaleId: number;
  title: string;
  image: string;
  total_pages: number;
  current_page: number;
  is_completed: boolean;
}

export interface FairyTaleListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: FairyTaleListItem[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

