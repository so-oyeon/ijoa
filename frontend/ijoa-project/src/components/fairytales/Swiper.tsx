import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import bookclip from "/assets/fairytales/images/bookclip.png";

interface BookCoverSwiperProps {
  bookCovers: string[]; // 스와이퍼에 넣을 이미지 리스트
  titles: string[]; // 스와이퍼에 넣을 제목 리스트
  onBookClick: (index: number) => void; // 클릭 핸들러 추가
  spaceBetween?: number; // 이미지 사이 간 간격
  slidesPerView?: number; // 페이지 당 이미지 개수
  isCompleted: boolean[];
}

const BookCoverSwiper: React.FC<BookCoverSwiperProps> = ({
  bookCovers, // 책 표지 사진들
  titles, // 책 제목들
  onBookClick, // 클릭 핸들러
  spaceBetween = 20, // 사진 간 간격
  slidesPerView = 3.5, // 화면 당 슬라이드 개수
  isCompleted,
}) => {
  return (
    <Swiper spaceBetween={spaceBetween} slidesPerView={slidesPerView} onSlideChange={() => {}} onSwiper={() => {}}>
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index}>
          <div onClick={() => onBookClick(index + 1)} className="block text-center cursor-pointer">
            <div className="relative">
              {" "}
              <img src={cover} alt="동화책 표지 사진" className="w-[340px] h-[200px] object-cover rounded-3xl" />
              {isCompleted[index] && (
                <img src={bookclip} alt="책 완료 표시" className="absolute top-0 -right-2 w-20 h-20 z-50" />
              )}
            </div>
            <div className="mt-2 ml-2 font-bold text-left">
              <span className="text-xl">{titles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCoverSwiper;
