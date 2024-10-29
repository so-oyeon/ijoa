import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ParentHeader from "./components/common/Header";
import CreateChildProfile from "./pages/parent/ChildProfileList";
import FairytaleListPage from "./pages/fairytales/FairytaleListPage";
import FairyTaleContentPage from "./pages/fairytales/FairytaleContentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 페이지에 Header가 포함된 화면 */}
        <Route
          path="/*"
          element={
            <>
              <ParentHeader />
              <div>
                <Routes>
                  <Route>
                    {/* 부모의 자녀 목록 화면 */}
                    <Route path="/parent/child/list" element={<CreateChildProfile />} />
                  </Route>
                </Routes>
              </div>
            </>
          }
        />

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
