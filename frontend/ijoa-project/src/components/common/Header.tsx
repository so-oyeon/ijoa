import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../fairytales/main/SettingsModal";
import ParentSettingsModal from "../../components/parent/ParentSettingsModal";
import ProfileDropDown from "./ProfileDropDown";
import Tutorial from "../tutorial/Tutorial";

const Header = () => {
  const type = localStorage.getItem("userType");
  const [isChildSettingsModalOpen, setIsChildSettingsModalOpen] = useState(false); // 자녀 헤더 설정 모달창 열림 여부 상태 변수
  const [isParentSettingsModalOpen, setIsParentSettingsModalOpen] = useState(false); // 부모 헤더 설정 모달창 열림 여부 상태 변수
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const navigate = useNavigate();

  // 로고와 메뉴 위치 상태와 참조 생성
  const menuRefs = useRef<HTMLButtonElement[]>([]);

  const [menuPositions, setMenuPositions] = useState<{ top: number; left: number; width: number; height: number }[]>(
    []
  );

  useEffect(() => {
    if (menuRefs.current.length === 0) return;

    setTimeout(() => {
      const positions = menuRefs.current.map((menu) => {
        if (menu) {
          const rect = menu.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          };
        }
        return { top: 0, left: 0, width: 0, height: 0 };
      });
      setMenuPositions(positions);
    }, 0); // 다음 렌더 사이클에서 실행
  }, []);

  useEffect(() => {
    // type이 변경될 때 selectedTab 기본값 설정
    setSelectedTab(type === "parent" ? 0 : null);
  }, [type]);

  useEffect(() => {
    {
      // 조건이 충족되었을 때 실행할 다른 코드가 없다면 아무 작업도 하지 않음
    }
  }, [menuPositions]);

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
    navigate(`/child/fairytale/total`);
  };

  // 자녀 메인 라우팅
  const fairytalelistClick = () => {
    navigate(`/child/fairytale/total`);
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
    { img: "tts-icon", text: "음성학습", action: ttsClick, isSetting: false },
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
        <img className="h-[100px] active:scale-110" src="/assets/logo.png" alt="" onClick={handleGoToMain}/>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* 메뉴 */}
        {menuToDisplay.map((menu, index) => (
          <button
            key={index}
            ref={(el) => {
              if (el && !menuRefs.current.includes(el)) {
                menuRefs.current.push(el);
              }
            }}
            className={`w-14 flex flex-col justify-center items-center space-y-1 transform transition-transform duration-200`}
            onClick={() => handleTabClick(index, menu.action, menu.isSetting)}
          >
            <img
              className={`w-12 aspect-1 p-2 bg-white rounded-full object-cover shadow-[0_3px_3px_1px_rgba(0,0,0,0.1)] ${
                selectedTab === index ? "bg-[#F8FFAB]" : ""
              }`}
              src={`/assets/header/${type}/${menu.img}.png`}
              alt=""
            />
            <p className={`text-sm text-[#B27F44] font-bold`}>{menu.text}</p>
          </button>
        ))}

        {/* Tutorial 컴포넌트에 props 전달 */}
        <Tutorial menuPositions={menuPositions} />

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
