import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { FairyTaleReadCheckItem } from "../../types/fairytaleTypes";

interface Props {
  direction: string;
  myBookLists: FairyTaleReadCheckItem[];
  myBookReadOrNot: boolean[];
}

const MyBookSwiper = ({ direction, myBookLists, myBookReadOrNot }: Props) => {
  const myBookCovers = myBookLists.map((book) => book.image);
  const myBookTitles = myBookLists.map((book) => book.title);

  return (
    <Swiper
      dir={`${direction === "reverse" ? "rtl" : ""}`}
      slidesPerView={3.5}
      spaceBetween={30}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      speed={4000}
      loop={true}
      freeMode={true}
      modules={[FreeMode, Autoplay]}
      className="mySwiper"
    >
      {myBookCovers.map((cover, index) => (
        <SwiperSlide key={index}>
          <div className="block text-center cursor-pointer">
            <img src={cover} alt={`동화책 ${index + 1}`} className="w-[380px] h-[200px] object-cover rounded-3xl" />
            <div className="mt-2 text-left">
              <span className="text-xl text-white line-clamp-1">{myBookTitles[index]}</span>
              <div>{myBookReadOrNot[index] ? "읽음" : "읽지 않음"}</div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyBookSwiper;
