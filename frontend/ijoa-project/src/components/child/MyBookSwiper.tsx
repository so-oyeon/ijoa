import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { FairyTaleReadCheckItem } from "../../types/fairytaleTypes";
import bookclip from "/assets/fairytales/images/bookclip.png"; // 뱃지 이미지 import
import { useNavigate } from "react-router-dom";

interface Props {
  direction: string;
  myBookLists: FairyTaleReadCheckItem[];
  myBookReadOrNot: boolean[];
  progress: number[];
}

const MyBookSwiper = ({ direction, myBookLists, myBookReadOrNot, progress }: Props) => {
  const myBookCovers = myBookLists.map((book) => book.image);
  const myBookTitles = myBookLists.map((book) => book.title);
  const myBookIds = myBookLists.map((book) => book.fairytaleId);
  const navigate = useNavigate();

  const toContentPage = (id: number) => {
    navigate(`/fairytale/content/${id}`);
  };

  return (
    <Swiper
      dir={`${direction === "reverse" ? "rtl" : "ltr"}`}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      speed={4000}
      loop={true}
      freeMode={true}
      modules={[FreeMode, Autoplay]}
      className="mySwiper"
      style={{ overflow: "visible" }}
      breakpoints={{
        320: { slidesPerView: 2, spaceBetween: 10 },
        640: { slidesPerView: 3, spaceBetween: 15 },
        768: { slidesPerView: 3.5, spaceBetween: 20 },
        1024: { slidesPerView: 4.5, spaceBetween: 25 },
        1280: { slidesPerView: 5.5, spaceBetween: 30 },
        1536: { slidesPerView: 6, spaceBetween: 30 },
      }}
    >
      {myBookCovers.map((cover, index) => (
        <SwiperSlide key={index} style={{ overflow: "visible" }}>
          <div className="block text-center cursor-pointer gap-10">
            <div className="relative w-[200px] h-[220px] mx-auto">
              <img
                src={cover}
                alt={`동화책 ${index + 1}`}
                onClick={() => toContentPage(myBookIds[index])}
                className="book-cover-image w-full h-[210px] object-cover rounded-lg"
              />

              {/* 읽음 여부에 따라 우측 상단에 뱃지 이미지 표시 */}
              {myBookReadOrNot[index] && (
                <img src={bookclip} alt="읽음 표시" className="absolute -top-7 -right-3 w-20 h-20 z-50" />
              )}

              {/* 진행 상태바 */}
              {progress[index] > 0 && progress[index] < 100 && (
                <div dir="ltr" className="absolute bottom-2 left-0 w-full h-2 bg-gray-300 rounded-b">
                  <div className="h-full bg-red-400 rounded-b" style={{ width: `${progress[index]}%` }}></div>
                </div>
              )}
            </div>
            <div dir="ltr" className="text-center mx-auto w-[200px]">
              <span className="text-lg md:text-xl font-bold text-black line-clamp-1">{myBookTitles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyBookSwiper;
