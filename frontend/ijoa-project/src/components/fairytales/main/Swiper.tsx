import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../../../css/FairytaleContentPage.css";
import bookclip from "/assets/fairytales/images/bookclip.png";

interface BookCoverSwiperProps {
  bookCovers: string[];
  titles: string[];
  onBookClick: (index: number) => void;
  spaceBetween?: number;
  slidesPerView?: number;
  isCompleted: boolean[];
  progress?: number[];
}

const BookCoverSwiper: React.FC<BookCoverSwiperProps> = ({
  bookCovers,
  titles,
  onBookClick,
  spaceBetween = 10,
  slidesPerView = 6.5,
  isCompleted,
  progress,
}) => {
  return (
    <Swiper
      style={{ overflow: "visible" }}
      breakpoints={{
        320: {
          slidesPerView: 1.5,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 2.5,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3.5,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 4.5,
          spaceBetween: 15,
        },
        1280: {
          slidesPerView: 5.5,
          spaceBetween: 20,
        },
        1536: {
          slidesPerView: slidesPerView, // 기본 설정 유지
          spaceBetween: spaceBetween, // 기본 설정 유지
        },
      }}
    >
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index} style={{ overflow: "visible" }}>
          <div onClick={() => onBookClick(index)} className="block w-[200px] text-center cursor-pointer">
            <div className="relative w-[200px] h-[220px]">
              <img
                src={cover}
                alt="동화책 표지 사진"
                className="w-full h-full object-cover rounded-xl"
              />
              {progress && progress[index] > 0 && progress[index] < 100 && (
                <div className="absolute bottom-[0px] left-0 w-full h-2 bg-gray-300">
                  <div className="h-full bg-red-400" style={{ width: `${progress[index]}%` }}></div>
                </div>
              )}
              {isCompleted && isCompleted[index] && (
                <img src={bookclip} alt="책 완료 표시" className="absolute -top-4 -right-2 w-16 h-16 z-10" />
              )}
              <div className="absolute -bottom- left-0 text-lg md:text-xl font-semibold font-['MapleLight'] text-black bg-white bg-opacity-50 rounded-b-lg w-full py-1 shadow-md line-clamp-1 text-center">
                <span>{titles[index]}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCoverSwiper;
