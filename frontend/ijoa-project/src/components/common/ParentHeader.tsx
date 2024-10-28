import React from "react";

const ParentHeader = () => {
  const menu = [
    { img: "child-icon", text: "자녀" },
    { img: "tts-icon", text: "TTS" },
    { img: "stats-icon", text: "통계" },
    { img: "voice-album-icon", text: "음성앨범" },
    { img: "setting-icon", text: "설정" },
  ];

  return (
    <div className="w-full h-24 px-10 py-3 bg-gradient-to-b from-white flex justify-between fixed top-0">
      <img className="h-full" src="/assets/logo.png" alt="" />

      <div className="grid grid-cols-5 gap-3">
        {menu.map((menu, index) => (
          <button className="flex flex-col justify-center items-center space-y-1" key={index}>
            <img
              className="w-12 aspect-1 p-2 bg-white rounded-full shadow-[0_3px_3px_2px_rgba(0,0,0,0.1)] "
              src={`/assets/header/parent/${menu.img}.png`}
              alt=""
            />
            <p className="text-sm text-[#B27F44] font-bold">{menu.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParentHeader;
