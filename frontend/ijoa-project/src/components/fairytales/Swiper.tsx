import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../../css/FairytaleContentPage.css";
import bookclip from "/assets/fairytales/images/bookclip.png";

interface BookCoverSwiperProps {
  bookCovers: string[];
  titles: string[];
  onBookClick: (index: number) => void;
  spaceBetween?: number;
  slidesPerView?: number;
  isCompleted: boolean[];
}

const BookCoverSwiper: React.FC<BookCoverSwiperProps> = ({
  bookCovers,
  titles,
  onBookClick,
  spaceBetween = 20,
  slidesPerView = 3.5,
  isCompleted,
}) => {
  return (
    <Swiper spaceBetween={spaceBetween} slidesPerView={slidesPerView} style={{ overflow: 'visible' }}>
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index} style={{ overflow: 'visible' }}>
          <div onClick={() => onBookClick(index)} className="block text-center cursor-pointer h-full">
            <div>
              <img
                src={cover}
                alt="동화책 표지 사진"
                className="relative w-[380px] h-[200px] object-cover rounded-3xl"
              />
            </div>
            {isCompleted && isCompleted[index] && (
              <img src={bookclip} alt="책 완료 표시" className="absolute -top-7 right-2 w-20 h-20 z-50" />
            )}
            <div className="mt-2 ml-2 font-bold text-left font-['MapleLight']">
              <span className="text-xl">{titles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCoverSwiper;
