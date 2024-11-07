export interface VoiceAlbumDetailCardInfo {
  img: string;
  question: string;
  answer: string;
}

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
