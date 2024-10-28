import React from "react";
// 스와이퍼 컴포넌트 import
import Swiper from "../../components/Swiper";
import bookcover from "../../assets/images/bookcover.png";

const FairytaleListPage: React.FC = () => {
  // 스와이퍼에 들어갈 사진 리스트
  const bookCovers = [bookcover, bookcover, bookcover, bookcover, bookcover, bookcover, bookcover];
  const titles = ["동화책 1", "동화책 2", "동화책 3", "동화책 4", "동화책 5", "동화책 6", "동화책 7"];
  return (
    <div>
      <div className="mt-36 mb-10">
        <div className="mb-3 text-2xl font-bold">🏆 9살 인기 동화책</div>
        <Swiper bookCovers={bookCovers} titles={titles} />
      </div>
      <div className="mb-10">
        <div className="mb-3 text-2xl font-bold">🧸 이런 책 어때요?</div>
        <Swiper bookCovers={bookCovers} titles={titles} />
      </div>
      <div>
        <div className="mb-3 text-2xl font-bold">🌟 카테고리 별 인기 동화책</div>
        <Swiper bookCovers={bookCovers} titles={titles} />
      </div>
    </div>
  );
};

export default FairytaleListPage;
