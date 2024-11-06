import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../../components/fairytales/SettingsModal";
import ParentSettingsModal from "../../components/parent/ParentSettingsModal";
import ProfileDropDown from "./ProfileDropDown";
import { childApi } from "../../api/childApi";
import { ChildInfo } from "../../types/childTypes";

const Header = () => {
  const type = localStorage.getItem("userType");
  const [isChildSettingsModalOpen, setIsChildSettingsModalOpen] = useState(false); // 자녀 헤더 설정 모달창 열림 여부 상태 변수
  const [isParentSettingsModalOpen, setIsParentSettingsModalOpen] = useState(false); // 부모 헤더 설정 모달창 열림 여부 상태 변수
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const navigate = useNavigate();

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
      childClick();
    } else {
      fairytalelistClick();
    }
  };

  // 자녀 프로필을 가져오는 api 통신 함수
  const getChildProfile = async () => {
    const childId = parseInt(localStorage.getItem("childId") || "0", 10);
    if (!childId) {
      console.error("Child ID is undefined");
      return;
    }

    try {
      const response = await childApi.getChildProfile(childId);
      if (response.status === 200 && response.data) {
        setChildInfo(response.data);
      }
    } catch (error) {
      console.error("childApi의 getChildProfile:", error);
    }
  };

  const parentMenu = [
    { img: "child-icon", text: "자녀", action: childClick },
    { img: "tts-icon", text: "TTS", action: ttsClick },
    { img: "stats-icon", text: "통계", action: statsClick },
    { img: "voice-album-icon", text: "음성앨범", action: voiceAlbumClick },
    { img: "setting-icon", text: "설정", action: openParentSettingsModal },
  ];

  const childMenu = [
    { img: "library-icon", text: "도서관", action: libraryClick },
    { img: "bookcase-icon", text: "내 책장", action: myRoomBookShelvesClick },
    { img: "myroom-icon", text: "내 방", action: myRoomClick },
    { img: "setting-icon", text: "설정", action: openSettingsModal },
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

        {/* 프로필 모달 */}
        {type === "child" && <ProfileDropDown childInfo={childInfo} onProfileClick={getChildProfile} />}
      </div>

      {/* 자녀 헤더 설정 모달창 */}
      <SettingsModal isOpen={isChildSettingsModalOpen} onClose={closeSettingsModal} />

      {/* 부모 헤더 설정 모달창 */}
      <ParentSettingsModal isOpen={isParentSettingsModalOpen} onClose={closeParentSettingsModal} />
    </div>
  );
};

export default Header;
