import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface BookCoverSwiperProps {
  bookCovers: string[]; // 스와이퍼에 넣을 이미지 리스트
  titles: string[]; // 스와이퍼에 넣을 제목 리스트
  onBookClick: (index: number) => void; // 클릭 핸들러 추가
  spaceBetween?: number; // 이미지 사이 간 간격
  slidesPerView?: number; // 페이지 당 이미지 개수
}

const BookCoverSwiper: React.FC<BookCoverSwiperProps> = ({
  bookCovers, // 책 표지 사진들
  titles, // 책 제목들
  onBookClick, // 클릭 핸들러
  spaceBetween = 10, // 사진 간 간격
  slidesPerView = 3.5, // 화면 당 슬라이드 개수
}) => {
  return (
    <Swiper spaceBetween={spaceBetween} slidesPerView={slidesPerView} onSlideChange={() => {}} onSwiper={() => {}}>
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index}>
          <div
            onClick={() => onBookClick(index + 1)} // index + 1로 수정하여 정확한 경로로 내비게이션
            className="block text-center cursor-pointer"
          >
            <img src={cover} alt="동화책 표지 사진" className="w-full" />
            <div className="mt-2 text-left">
              <span className="text-xl">{titles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCoverSwiper;
