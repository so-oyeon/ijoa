import React, { useState, useEffect } from "react";
import SplashScreen from "./pages/users/SplashScreen";
import Login from "./pages/users/Login";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 스플래시 화면이 3초 후에 사라지고 로그인 화면 표시
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 스플래시 애니메이션 시간보다 조금 더 길게 설정

    return () => clearTimeout(timer);
  }, []);

  return <div>{showSplash ? <SplashScreen /> : <Login />}</div>;
};

export default App;
