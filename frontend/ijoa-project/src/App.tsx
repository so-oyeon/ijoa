import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/common/Header";
import CreateChildProfile from "./pages/parent/ChildProfileList";
import FairytaleListPage from "./pages/fairytales/FairytaleListPage";
import FairyTaleContentPage from "./pages/fairytales/FairytaleContentPage";
import SplashScreen from "./pages/users/SplashScreen";
import Login from "./pages/users/Login";
import TTSList from "./pages/parent/TTSList";
import MyRoom from "./pages/child/MyRoom";
import MyBookShelves from "./pages/child/MyBookShelves";
import VoiceAlbum from "./pages/parent/VoiceAlbum";
import VoiceAlbumDetail from "./pages/parent/VoiceAlbumDetail";
import ReadingStatistics from "./pages/parent/ReadingStats";
import FairytaleSearchPage from "./pages/fairytales/FairytaleSearchPage";
import MusicManager from "./MusicManager";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const isBgmEnabled = localStorage.getItem("bgm") === "true";

    if (location.pathname === "/home") {
      MusicManager.playLoginBgm();
    } else if (location.pathname.startsWith("/child") && isBgmEnabled) {
      MusicManager.playChildBgm();
    } else {  
      MusicManager.stopBgm();
    }
  }, [location]);

  return (
    <Routes>
      {/* 페이지에 Header가 포함된 화면 */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Routes>
              <Route>
                {/* 부모의 자녀 목록 화면 */}
                <Route path="/parent/child/list" element={<CreateChildProfile />} />
                {/* 부모의 TTS 목록 화면 */}
                <Route path="/parent/tts/list" element={<TTSList />} />
                {/* 부모의 통계 화면 */}
                <Route path="/parent/reading/stats" element={<ReadingStatistics />} />
                {/* 부모의 음성 앨범 화면 */}
                <Route path="/parent/voice/album" element={<VoiceAlbum />} />
                {/* 동화 목록 */}
                <Route path="/child/fairytale/list" element={<FairytaleListPage />} />
                {/* 내 방 */}
                <Route path="/child/myroom" element={<MyRoom />} />
                {/* 내 책장 */}
                <Route path="/child/mybookshelves" element={<MyBookShelves />} />
                {/* 동화책 제목 검색 화면 */}
                <Route path="/child/fairytale/search" element={<FairytaleSearchPage />} />
              </Route>
            </Routes>
          </>
        }
      />

      {/* 스플래시 화면 */}
      <Route path="/" element={<SplashScreen />} />
      {/* 홈 화면 */}
      <Route path="/home" element={<Login />} />

      {/* 동화 내용 */}
      <Route path="/fairytale/content/:fairytaleId" element={<FairyTaleContentPage />} />

      {/* 부모의 음성 앨범 상세 화면 */}
      <Route path="/parent/voice/album/:id" element={<VoiceAlbumDetail />} />
    </Routes>
  );
};

export default App;
