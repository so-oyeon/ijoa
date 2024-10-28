import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import FairytaleListPage from "./pages/fairytales/FairytaleListPage";
import FairyTaleContentPage from "./pages/fairytales/FairytaleContentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 화면 */}
        <Route path="/" element={<Home />} />
        {/* 동화 목록 */}
        <Route path="/fairytale/list" element={<FairytaleListPage />} />
        {/* 동화 내용 */}
        <Route path="/fairytale/content" element={<FairyTaleContentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
