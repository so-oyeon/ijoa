import React, { useState } from "react";

const ParentHeader = () => {
  const [type, setType] = useState("parent");

  const parentMenu = [
    { img: "child-icon", text: "자녀" },
    { img: "tts-icon", text: "TTS" },
    { img: "stats-icon", text: "통계" },
    { img: "voice-album-icon", text: "음성앨범" },
    { img: "setting-icon", text: "설정" },
  ];

  const childMenu = [
    { img: "library-icon", text: "도서관" },
    { img: "bookcase-icon", text: "내 책장" },
    { img: "myroom-icon", text: "내 방" },
    { img: "setting-icon", text: "설정" },
    { img: "sampleProfileImg", text: "프로필" },
  ];

  const menuToDisplay = type === "parent" ? parentMenu : childMenu;

  return (
    <div className="w-full h-24 px-10 py-3 bg-gradient-to-b from-white flex justify-between fixed top-0">
      <img className="h-full" src="/assets/logo.png" alt="" />

      <div className="grid grid-cols-5 gap-3">
        {menuToDisplay.map((menu, index) => (
          <button className="w-14 flex flex-col justify-center items-center space-y-1" key={index}>
            <img
              className="w-12 aspect-1 p-2 bg-white rounded-full shadow-[0_3px_3px_1px_rgba(0,0,0,0.1)] "
              src={`/assets/header/${type}/${menu.img}.png`}
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
