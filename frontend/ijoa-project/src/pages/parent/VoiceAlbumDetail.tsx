import VoiceAlbumDetailCard from "../../components/parent/voiceAlbum/VoiceAlbumDetailCard";
import "../../css/VoiceAlbum.css";
import { TbArrowBigLeftFilled, TbArrowBigRightFilled } from "react-icons/tb";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const VoiceAlbumDetail = () => {
  const title = "이상한 나라의 앨리스";
  const voiceList = [
    {
      img: "fairytales/images/dummy1",
      question: "토끼가 시간이 없대! 어디로 도망가고 싶어?",
      answer: "",
    },
    {
      img: "fairytales/images/dummy2",
      question: "다람쥐가 도와주러 왔어! 다솔이는 다람쥐 좋아해?",
      answer: "",
    },
    {
      img: "fairytales/images/dummy3",
      question: "토끼가 시간이 없대! 어디로 도망가고 싶어?",
      answer: "",
    },
    {
      img: "fairytales/images/dummy4",
      question: "다람쥐가 도와주러 왔어! 다솔이는 다람쥐 좋아해?",
      answer: "",
    },
    {
      img: "fairytales/images/dummy5",
      question: "토끼가 시간이 없대! 무엇을 타고 갈까?",
      answer: "",
    },
  ];

  return (
    <div className="voice-album-font w-full min-h-screen px-10 pt-28 pb-5 flex flex-col space-y-3">
      <div className="flex-grow flex flex-col">
        {/* 파일 책갈피 */}
        <div className="flex">
          {/* 왼쪽 직사각형 */}
          <div className="w-auto min-w-80 h-16 px-5 py-3 text-2xl text-[#583A17] bg-[#FFEAB5] rounded-tl-2xl flex items-center">
            <p>{title}</p>
          </div>
          {/* 오른쪽 삼각형 */}
          <div className="w-0 h-0 border-b-[32px] border-l-[32px] border-t-[32px] border-r-[32px] border-b-[#FFEAB5] border-l-[#FFEAB5] border-t-transparent border-r-transparent relative top-[1px] right-[1px]"></div>
        </div>

        {/* 음성앨범 본문 */}
        <div className="w-full h-full p-5 bg-[#FFEAB5] rounded-tr-2xl rounded-b-2xl flex-grow flex">
          <Swiper slidesPerView={3} spaceBetween={30} className="flex-grow">
            {voiceList.map((voice, index) => (
              <SwiperSlide className="flex-grow" key={index}>
                <VoiceAlbumDetailCard voiceInfo={voice} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 화살표 및 쪽수 */}
      <div className="flex justify-center items-center space-x-5">
        <TbArrowBigLeftFilled className="text-6xl text-[#FBCA4E]" />
        <p className="text-4xl font-semibold text-[#5E3200]">2 / 5</p>
        <TbArrowBigRightFilled className="text-6xl text-[#FBCA4E]" />
      </div>
    </div>
  );
};

export default VoiceAlbumDetail;
