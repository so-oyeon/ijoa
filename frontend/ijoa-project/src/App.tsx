import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/common/Header";
import CreateChildProfile from "./pages/parent/ChildProfileList";
// import FairytaleListPage from "./pages/fairytales/FairytaleListPage";
import FairyTaleContentPage from "./pages/fairytales/FairytaleContentPage";
import Login from "./pages/users/Login";
import TTSList from "./pages/parent/TTSList";
import MyRoom from "./pages/child/MyRoom";
import MyBookShelves from "./pages/child/MyBookShelves";
import VoiceAlbum from "./pages/parent/VoiceAlbum";
import VoiceAlbumDetail from "./pages/parent/VoiceAlbumDetail";
import ReadingStatistics from "./pages/parent/ReadingStats";
// import FairytaleSearchPage from "./pages/fairytales/FairytaleSearchPage";
import MusicManager from "./MusicManager";
import SplashScreen from "./pages/users/SplashScreen";
import FairytaleTotalPage from "./pages/fairytales/FairytaleTotalPage";

const App = () => {
  const location = useLocation();
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isBgmEnabled = localStorage.getItem("bgm") === "true";

    if (location.pathname.startsWith("/child") && isBgmEnabled) {
      MusicManager.playChildBgm();
    } else if (location.pathname === "/") {
      if (isSplashFinished) {
        MusicManager.playLoginBgm();
      } else {
        MusicManager.stopBgm();
      }
    } else {
      MusicManager.stopBgm();
    }
  }, [location, isSplashFinished]);

  // 2초 타이머와 이미지 로딩 완료 상태를 모두 확인하여 SplashScreen 종료
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashFinished(true);
    }, 3000); // 3초로 설정
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsSplashFinished(true);
    }
  }, [isLoaded]);

  return (
    <Routes>
      {/* 첫 화면에서 SplashScreen 또는 Login 표시 */}
      <Route
        path="/"
        element={isSplashFinished ? <Login onAssetsLoaded={() => setIsLoaded(true)} /> : <SplashScreen />}
      />

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

                {/* 동화책 인기/추천/카테고리 & 전체도서/검색 화면 */}
                <Route path="/child/fairytale/total" element={<FairytaleTotalPage />} />

                {/* 내 방 */}
                <Route path="/child/myroom" element={<MyRoom />} />
                {/* 내 책장 */}
                <Route path="/child/mybookshelves" element={<MyBookShelves />} />
              </Route>
            </Routes>
          </>
        }
      />

      {/* 동화 내용 */}
      <Route path="/fairytale/content/:fairytaleId" element={<FairyTaleContentPage />} />

      {/* 부모의 음성 앨범 상세 화면 */}
      <Route path="/parent/voice/album/:bookId" element={<VoiceAlbumDetail />} />
    </Routes>
  );
};

export default App;
