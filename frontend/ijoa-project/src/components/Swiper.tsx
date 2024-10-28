import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface BookCoverSwiperProps {
  bookCovers: string[]; // 스와이퍼에 넣을 이미지 리스트
  titles: string[]; // 스와이퍼에 넣을 제목 리스트
  spaceBetween?: number; // 이미지 사이 간격
  slidesPerView?: number; // 페이지 당 이미지 개수
}

const BookCoverSwiper: React.FC<BookCoverSwiperProps> = ({
  bookCovers, // 책 표지 사진들
  titles, // 책 제목들
  spaceBetween = 30, // 사진 간 간격
  slidesPerView = 3.5, // 화면 당 슬라이드 개수
}) => {
  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      onSlideChange={() => {}}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index}>
          <img src={cover} alt={`Fairytale ${index + 1}`} />
          <div className="mt-2 text-left">
            {" "}
            <span className="text-xl">{titles[index]}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCoverSwiper;
