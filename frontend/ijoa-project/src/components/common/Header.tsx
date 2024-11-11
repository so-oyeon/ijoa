import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../../components/fairytales/SettingsModal";
import ParentSettingsModal from "../../components/parent/ParentSettingsModal";
import ProfileDropDown from "./ProfileDropDown";

const Header = () => {
  const type = localStorage.getItem("userType");
  const [isChildSettingsModalOpen, setIsChildSettingsModalOpen] = useState(false); // 자녀 헤더 설정 모달창 열림 여부 상태 변수
  const [isParentSettingsModalOpen, setIsParentSettingsModalOpen] = useState(false); // 부모 헤더 설정 모달창 열림 여부 상태 변수
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleTabClick = (index: number, action: () => void, isSetting: boolean) => {
    if (!isSetting) {
      setSelectedTab(index);
    }
    action();
  };

  // 부모 자녀 라우팅
  const childClick = () => {
    navigate(`/parent/child/list`);
  };

  // 부모 TTS 라우팅
  const ttsClick = () => {
    navigate(`/parent/tts/list`);
  };

  // 부모 통계 라우팅
  const statsClick = () => {
    navigate(`/parent/reading/stats`);
  };

  // 부모 음성앨범 라우팅
  const voiceAlbumClick = () => {
    navigate(`/parent/voice/album`);
  };

  // 자녀 내 방 라우팅
  const myRoomClick = () => {
    navigate(`/child/myroom`);
  };

  // 자녀 도서관 라우팅
  const libraryClick = () => {
    navigate(`/child/fairytale/search`);
  };

  // 자녀 메인 라우팅
  const fairytalelistClick = () => {
    navigate(`/child/fairytale/list`);
  };

  // 자녀 내 책장 라우팅
  const myRoomBookShelvesClick = () => {
    navigate(`/child/mybookshelves`);
  };

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

  // 로고 클릭 시, 사용자 타입에 맞게 메인으로 리다이렉트
  const handleGoToMain = () => {
    if (type === "parent") {
      setSelectedTab(0); // "자녀" 탭 인덱스
      childClick();
    } else {
      setSelectedTab(null); // 자녀 화면일 경우 선택된 탭 없음
      fairytalelistClick();
    }
  };

  const parentMenu = [
    { img: "child-icon", text: "자녀", action: childClick, isSetting: false },
    { img: "tts-icon", text: "TTS", action: ttsClick, isSetting: false },
    { img: "stats-icon", text: "통계", action: statsClick, isSetting: false },
    { img: "voice-album-icon", text: "음성앨범", action: voiceAlbumClick, isSetting: false },
    { img: "setting-icon", text: "설정", action: openParentSettingsModal, isSetting: true },
  ];

  const childMenu = [
    { img: "library-icon", text: "도서관", action: libraryClick, isSetting: false },
    { img: "bookcase-icon", text: "내 책장", action: myRoomBookShelvesClick, isSetting: false },
    { img: "myroom-icon", text: "내 방", action: myRoomClick, isSetting: false },
    { img: "setting-icon", text: "설정", action: openSettingsModal, isSetting: true },
  ];

  const menuToDisplay = type === "parent" ? parentMenu : childMenu;

  return (
    <div className="w-full h-24 px-10 py-3 bg-gradient-to-b from-white flex justify-between items-center fixed top-0 z-50">
      <div className="w-2/3 h-full flex items-center space-x-5">
        {/* 로고 */}
        <img className="h-full" src="/assets/logo.png" alt="" onClick={handleGoToMain} />
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* 메뉴 */}
        {menuToDisplay.map((menu, index) => (
          <button
            key={index}
            className={`w-14 flex flex-col justify-center items-center space-y-1 transform transition-transform duration-200 ${
              selectedTab === index && !menu.isSetting ? "text-[#67CCFF]" : "text-[#B27F44]"
            } ${selectedTab === index && !menu.isSetting ? "" : "hover:scale-125"}`}
            onClick={() => handleTabClick(index, menu.action, menu.isSetting)}
          >
            <img
              className="w-12 aspect-1 p-2 bg-white rounded-full shadow-[0_3px_3px_1px_rgba(0,0,0,0.1)]"
              src={`/assets/header/${type}/${menu.img}.png`}
              alt=""
            />
            <p className={`text-sm text-[#B27F44] font-bold ${selectedTab === index ? "blue-highlight" : ""}`}>
              {menu.text}
            </p>
          </button>
        ))}

        {/* 프로필 모달 */}
        {type === "child" && <ProfileDropDown />}
      </div>

      {/* 자녀 헤더 설정 모달창 */}
      <SettingsModal isOpen={isChildSettingsModalOpen} onClose={closeSettingsModal} />

      {/* 부모 헤더 설정 모달창 */}
      <ParentSettingsModal isOpen={isParentSettingsModalOpen} onClose={closeParentSettingsModal} />
    </div>
  );
};

export default Header;
