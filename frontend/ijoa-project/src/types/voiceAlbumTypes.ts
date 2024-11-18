// 음성 앨범 답변한 책 목록 조회 요청 데이터
export interface VoiceAlbumDateRange {
  startDate: string;
  endDate: string;
}

// 음성 앨범 답변한 책 목록 조회 응답 데이터
export interface VoiceAlbumBookInfo {
  book_id: number;
  image: string;
  title: string;
}

// 음성 앨범 답변한 책 상세 조회 응답 데이터
export interface VoiceAlbumBookDetailInfo {
  answer: string;
  answerId: number;
  fairytaleId: number;
  image: string;
  questionText: string;
  quizId: number;
}