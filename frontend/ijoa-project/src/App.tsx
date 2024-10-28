import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ParentHeader from "./components/common/ParentHeader";
import CreateChildProfile from "./pages/parent/ChildProfileList";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
