import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleListItem } from "../../types/fairytaleTypes";

import { useEffect, useState } from "react";

interface Props {
  direction: string;
}

const MyBookSwiper = ({ direction }: Props) => {
  const [myBookLists, setMyBookLists] = useState<FairyTaleListItem[]>([]);

  // 읽은 책 or 읽는 중인 책 조회 api 통신 함수
  const getMyBookLists = async () => {
    try {
      const response = await fairyTaleApi.getFairytalesReadList(0);
      if (response.status === 200) {
        const data = response.data;
        if (data && Array.isArray(data.content)) {
          setMyBookLists(data.content);
        } else {
          console.error("유효하지 않은 데이터 구조 :", data);
        }
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairytalesReadList :", error);
    }
  };

  const myBookCovers = myBookLists.map((book) => book.image);
  const myBookTitles = myBookLists.map((book) => book.title);

  useEffect(() => {
    getMyBookLists();
  });

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
            <img src={cover} alt={`동화책 ${index + 1}`} className="w-full" />
            <div className="mt-2 text-left">
              <span className="text-xl text-white line-clamp-1">{myBookTitles[index]}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyBookSwiper;
