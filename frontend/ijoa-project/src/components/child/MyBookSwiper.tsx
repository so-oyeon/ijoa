import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";

import BookCover from "/assets/fairytales/images/bookcover.png";

interface Props {
  direction: string;
}

const MyBookSwiper = ({ direction }: Props) => {
  // 스와이퍼에 들어갈 사진 리스트
  const bookCovers = [
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
    BookCover,
  ];

  // 스와이퍼에 들어갈 제목 리스트
  const titles = [
    "동화책 1",
    "동화책 2",
    "동화책 3",
    "동화책 4",
    "동화책 5",
    "동화책 6",
    "동화책 7",
    "동화책 8",
    "동화책 9",
    "동화책 10",
  ];

  return (
    <Swiper
      dir={`${direction === "reverse" ? "rtl" : ""}`}
      slidesPerView={3.5}
      spaceBetween={30}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      speed={2000}
      loop={true}
      freeMode={true}
      modules={[FreeMode, Autoplay]}
      className="mySwiper"
    >
      {bookCovers.map((cover, index) => (
        <SwiperSlide key={index}>
          <div className="block text-center cursor-pointer">
            <img src={cover} alt={`동화책 ${index + 1}`} className="w-full" />
            <div className="mt-2 text-left">
              <span className="text-xl text-white">{titles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyBookSwiper;
