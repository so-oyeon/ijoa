import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import SettingsModal from "../../components/fairytales/SettingsModal";
import ParentSettingsModal from "../../components/parent/ParentSettingsModal";

const ParentHeader = () => {
  const [type] = useState("parent");
  const path = window.location.pathname;
  const [isChildSettingsModalOpen, setIsChildSettingsModalOpen] = useState(false); // 자녀 헤더 설정 모달창 열림 여부 상태 변수
  const [isParentSettingsModalOpen, setIsParentSettingsModalOpen] = useState(false); // 부모 헤더 설정 모달창 열림 여부 상태 변수

  // 자녀 헤더 설정 모달창 열기
  const openSettingsModal = () => {
    setIsChildSettingsModalOpen(true);
  };
  // 자녀 헤더 설정 모달창 닫기
  const closeSettingsModal = () => {
    setIsChildSettingsModalOpen(false);
  };
  // 부모 헤더 설정 모달창 열기
  const openParentSettingsModal = () => {
    setIsParentSettingsModalOpen(true);
  };
  // 부모 헤더 설정 모달창 닫기
  const closeParentSettingsModal = () => {
    setIsParentSettingsModalOpen(false);
  };

  const parentMenu = [
    { img: "child-icon", text: "자녀" },
    { img: "tts-icon", text: "TTS" },
    { img: "stats-icon", text: "통계" },
    { img: "voice-album-icon", text: "음성앨범" },
    { img: "setting-icon", text: "설정", action: openParentSettingsModal },
  ];

  const childMenu = [
    { img: "library-icon", text: "도서관" },
    { img: "bookcase-icon", text: "내 책장" },
    { img: "myroom-icon", text: "내 방" },
    { img: "setting-icon", text: "설정", action: openSettingsModal },
    { img: "sampleProfileImg", text: "프로필" },
  ];

  const menuToDisplay = type === "parent" ? parentMenu : childMenu;

  return (
    <div className="w-full h-24 px-10 py-3 bg-gradient-to-b from-white flex justify-between items-center fixed top-0 z-50">
      <div className="w-2/3 h-full flex items-center space-x-5">
        <img className="h-full" src="/assets/logo.png" alt="" />

        {path === "/fairytale/list" ? (
          <div className="w-1/2 h-5/6 px-5 py-3 bg-white border-2 rounded-[100px] flex items-center space-x-3">
            <IoSearchSharp className="text-2xl" />
            <input
              className="w-full text-xl font-semibold outline-none"
              type="text"
              placeholder="제목 또는 키워드로 검색해 보세요"
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {menuToDisplay.map((menu, index) => (
          <button
            className="w-14 flex flex-col justify-center items-center space-y-1"
            key={index}
            onClick={menu.action}
          >
            <img
              className="w-12 aspect-1 p-2 bg-white rounded-full shadow-[0_3px_3px_1px_rgba(0,0,0,0.1)]"
              src={`/assets/header/${type}/${menu.img}.png`}
              alt=""
            />
            <p className="text-sm text-[#B27F44] font-bold">{menu.text}</p>
          </button>
        ))}
      </div>

      {/* 자녀 헤더 설정 모달창 */}
      <SettingsModal isOpen={isChildSettingsModalOpen} onClose={closeSettingsModal} />

      {/* 부모 헤더 설정 모달창 */}
      <ParentSettingsModal isOpen={isParentSettingsModalOpen} onClose={closeParentSettingsModal} />
    </div>
  );
};

export default ParentHeader;
