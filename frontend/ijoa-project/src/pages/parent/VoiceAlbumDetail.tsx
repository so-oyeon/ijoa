import VoiceAlbumDetailCard from "../../components/parent/voiceAlbum/VoiceAlbumDetailCard";
import "../../css/VoiceAlbum.css";
import { TbArrowBigLeftFilled, TbArrowBigRightFilled } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";

import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VoiceAlbumDetail = () => {
  const navigate = useNavigate();
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
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const handlePrev = () => {
    // 이전으로 이동
    swiper?.slidePrev();
  };

  const handleNext = () => {
    // 다음으로 이동
    swiper?.slideNext();
  };

  const handleGoToList = () => {
    navigate("/parent/voice/album");
  };

  return (
    <div className="voice-album-font w-full min-h-screen px-10 pt-10 pb-5 flex flex-col space-y-3">
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-center">
          {/* 파일 책갈피 */}
          <div className="flex">
            {/* 왼쪽 직사각형 */}
            <div className="w-auto min-w-80 h-16 px-5 py-3 text-2xl text-[#583A17] bg-[#FFEAB5] rounded-tl-2xl flex items-center">
              <p>{title}</p>
            </div>
            {/* 오른쪽 삼각형 */}
            <div className="w-0 h-0 border-b-[32px] border-l-[32px] border-t-[32px] border-r-[32px] border-b-[#FFEAB5] border-l-[#FFEAB5] border-t-transparent border-r-transparent relative top-[1px] right-[1px]"></div>
          </div>

          {/* 목록으로 버튼 */}
          <button
            className="px-5 py-2 text-2xl text-white bg-[#FFA64A] rounded-full flex items-center space-x-3"
            onClick={handleGoToList}>
            <FaArrowLeft />
            <span>목록으로</span>
          </button>
        </div>

        {/* 음성앨범 본문 */}
        <div className="w-full h-full p-5 bg-[#FFEAB5] rounded-tr-2xl rounded-b-2xl flex-grow flex">
          <Swiper
            className="flex-grow"
            slidesPerView={3} // 보여질 슬라이더 수
            spaceBetween={30} // 슬라이더 간격
            centeredSlides={true} // 슬라이더의 center 유무
            allowTouchMove={false} // 마우스로 슬라이더 이동 유무
            // 슬라이더가 변경될 때
            onSlideChange={(e) => {
              // 현재 슬라이더 인덱스 접근
              setCurrentSlideIdx(e.activeIndex);
              // 시작 슬라이더인지 아닌지 boolean 반환
              setIsBeginning(e.isBeginning);
              // 마지막 슬라이더인지 아닌지 boolean 반환
              setIsEnd(e.isEnd);
            }}
            // 슬라이더 변수화
            onSwiper={(e) => {
              setSwiper(e);
            }}>
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
        <TbArrowBigLeftFilled
          className={`text-6xl text-[#FBCA4E] ${isBeginning ? "opacity-50" : ""}`}
          onClick={handlePrev}
        />
        <p className="w-20 text-4xl font-semibold text-[#5E3200]">
          {currentSlideIdx + 1} / {voiceList.length}
        </p>
        <TbArrowBigRightFilled
          className={`text-6xl text-[#FBCA4E] ${isEnd ? "opacity-50" : ""}`}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default VoiceAlbumDetail;
