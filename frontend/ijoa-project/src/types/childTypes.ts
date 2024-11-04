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