import { useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import TTSCreateModal from "../../components/parent/tts/TTSCreateModal";

const TTSList = () => {
  const [isCreateModal, setIsCreateModal] = useState(false);
  const childList = [
    {
      img: "sampleProfileImg",
      name: "아빠",
    },
    {
      img: "sampleProfileImg",
      name: "엄마",
    },
    {
      img: "sampleProfileImg",
      name: "하츄핑",
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-[#EAF8FF] relative">
      <div className="p-20 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex justify-center items-center space-x-3">
          <img className="w-10 aspect-1" src="/assets/header/parent/tts-icon.png" alt="" />
          <p className="text-[30px] font-semibold">사용자의 목소리로 학습된 TTS 목록이에요</p>
        </div>

        <div className="flex justify-center space-x-10">
          {/* TTS 목록 */}
          {childList.map((child, index) => (
            <div className="flex flex-col items-center space-y-3" key={index}>
              <div className="w-32 aspect-1 relative">
                <img
                  className="w-full aspect-1 bg-white rounded-full border border-[#565656] object-cover"
                  src={`/assets/header/child/${child.img}.png`}
                  alt=""
                />
                <div className="w-10 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0">
                  <TbPencilMinus className="text-2xl" />
                </div>
              </div>

              <p className="text-2xl font-bold">{child.name}</p>
            </div>
          ))}

          {/* TTS 추가 버튼 */}
          {childList.length < 4 ? (
            <button className="flex justify-center items-center">
              <IoIosAdd
                className="text-[100px] text-white bg-[#D9D9D9] rounded-full"
                onClick={() => setIsCreateModal(true)}
              />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isCreateModal ? <TTSCreateModal setIsCreateModal={setIsCreateModal} /> : <></>}
    </div>
  );
};

export default TTSList;
