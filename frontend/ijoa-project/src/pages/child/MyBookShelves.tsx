import React from "react";
import hall from "/assets/child/hall.png";
import MyBookSwiper from "../../components/child/MyBookSwiper";
import CurtainAnimation from "../../components/fairytales/CurtainAnimation";

const MyBookShelves: React.FC = () => {
  return (
    <div className="w-full h-screen relative">
      {/* 배경 이미지 */}
      <img src={hall} alt="배경" className="w-screen h-screen object-cover" />

      <div className="absolute z-20">
        <CurtainAnimation />
      </div>

      {/* 스와이퍼 */}
      <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <p className="mb-10 text-3xl text-white text-center">다솔이가 읽은 책</p>
        <div className="mb-5">
          <MyBookSwiper direction={""} />
        </div>
        <div>
          <MyBookSwiper direction={"reverse"} />
        </div>
      </div>
    </div>
  );
};

export default MyBookShelves;
