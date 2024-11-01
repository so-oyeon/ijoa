import axios from "axios"

// Axios 요청
const api = axios.create({
  baseURL: 'https://k11d105.p.ssafy.io',
});

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // // accessToken을 localStorage에서 가져오고
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // if (isTokenExpired(accessToken)) {
      //   // 토큰이 만료된 경우 처리
      //   console.error("토큰이 만료되었습니다. 다시 로그인해주세요.");
      //   localStorage.removeItem("accessToken");
      //   window.location.href = "/home"; // 로그인 페이지로 리다이렉트
      //   return Promise.reject(new Error("토큰이 만료되었습니다."));
      // }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
  },
  error => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      window.location.href = "/home"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default api;