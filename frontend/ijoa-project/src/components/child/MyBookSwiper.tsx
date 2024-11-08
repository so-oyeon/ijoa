import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { FairyTaleReadCheckItem } from "../../types/fairytaleTypes";
import bookclip from "/assets/fairytales/images/bookclip.png"; // 뱃지 이미지 import

interface Props {
  direction: string;
  myBookLists: FairyTaleReadCheckItem[];
  myBookReadOrNot: boolean[];
  progress: number[]; // progress 추가
}

const MyBookSwiper = ({ direction, myBookLists, myBookReadOrNot, progress }: Props) => {
  const myBookCovers = myBookLists.map((book) => book.image);
  const myBookTitles = myBookLists.map((book) => book.title);

  return (
    <Swiper
      dir={`${direction === "reverse" ? "rtl" : "ltr"}`}
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
      style={{ overflow: 'visible' }}
    >
      {myBookCovers.map((cover, index) => (
        <SwiperSlide key={index}  style={{ overflow: 'visible' }}>
          <div className="block text-center cursor-pointer">
            <div className="relative w-[380px]">
              <img src={cover} alt={`동화책 ${index + 1}`} className="w-full h-[200px] object-cover rounded-lg" />

              {/* 읽음 여부에 따라 우측 상단에 뱃지 이미지 표시 */}
              {myBookReadOrNot[index] && (
                <img src={bookclip} alt="읽음 표시" className="absolute -top-7 -right-3 w-20 h-20 z-10" />
              )}

              {/* 진행 상태바 */}
              {progress[index] > 0 && progress[index] < 100 && (
                <div dir="ltr" className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 rounded">
                  <div className="h-full bg-red-400 rounded" style={{ width: `${progress[index]}%` }}></div>
                </div>
              )}
            </div>
            <div dir="ltr" className={`mt-2 text-left ${direction === "reverse" ? "ml-10" : ""}`}>
              <span className="text-xl text-white line-clamp-1">{myBookTitles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyBookSwiper;
