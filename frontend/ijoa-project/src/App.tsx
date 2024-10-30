import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header";
import CreateChildProfile from "./pages/parent/ChildProfileList";
import FairytaleListPage from "./pages/fairytales/FairytaleListPage";
import FairyTaleContentPage from "./pages/fairytales/FairytaleContentPage";
import SplashScreen from "./pages/users/SplashScreen";
import Login from "./pages/users/Login";
import TTSList from "./pages/parent/TTSList";
import VoiceAlbum from "./pages/parent/VoiceAlbum";

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
                    {/* 부모의 음성 앨범 화면 */}
                    <Route path="/parent/voice/album" element={<VoiceAlbum />} />
                    {/* 동화 목록 */}
                    <Route path="/fairytale/list" element={<FairytaleListPage />} />
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
        <Route path="/fairytale/content" element={<FairyTaleContentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
