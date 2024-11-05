import { Routes, Route, BrowserRouter } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 페이지에 Header가 포함된 화면 */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <div>
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
                    <Route path="/fairytale/list" element={<FairytaleListPage />} />
                    {/* 내 방 */}
                    <Route path="/child/myroom" element={<MyRoom />} />
                    {/* 내 책장 */}
                    <Route path="/child/mybookshelves" element={<MyBookShelves />} />
                  </Route>
                </Routes>
              </div>
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
        {/* 동화책 제목 검색 화면 */}
        <Route path="/fairytale/search" element={<FairytaleSearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
