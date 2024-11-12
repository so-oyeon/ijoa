import { useEffect, useRef, useState } from "react";
import Seeso, { UserStatusOption, InitializationErrorType } from "seeso";
import { GazeInfo, WordPositionInfo } from "../../types/seesoTypes";

interface Props {
  wordPositions: WordPositionInfo[];
}

const SeesoComponent = ({ wordPositions }: Props) => {
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const gazeInfoRef = useRef<HTMLHeadingElement>(null);
  const [gazeInfo, setGazeInfo] = useState<GazeInfo | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const licenseKey = import.meta.env.VITE_SEESO_SDK_KEY;
  let seeSoInstance: Seeso | null = null;

  const initSeeso = async () => {
    const calibrationData = parseCalibrationDataInQueryString();
    if (calibrationData && licenseKey) {
      seeSoInstance = new Seeso();

      // UserStatusOption 객체 생성
      const userStatusOption = new UserStatusOption(true, false, false);
      const errorCode = await seeSoInstance.initialize(licenseKey, userStatusOption);

      if (errorCode === InitializationErrorType.ERROR_NONE) {
        // 카메라 스트림 생성
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        await seeSoInstance.startTracking(stream, onGaze, onDebug);
        await seeSoInstance.setCalibrationData(calibrationData);

        //   Attention 호출 간격
        seeSoInstance.setAttentionInterval(10);

        // 주의 점수를 주기적으로 확인
        setInterval(() => {
          console.log("Attention Score: ", seeSoInstance?.getAttentionScore());
          seeSoInstance?.addGazeCallback(onGaze);
        }, 1000); // 1초 간격으로 호출
      } else {
        console.error("Seeso initialization failed.");
      }
    } else {
      console.log("No calibration data given.");
      const calibrationButton = document.getElementById("calibrationButton");
      if (calibrationButton) {
        calibrationButton.addEventListener("click", onClickCalibrationBtn);
      }
    }
  };

  // 시선 정보를 갱신하고 화면에 표시하는 함수
  const onGaze = (gazeInfo: GazeInfo) => {
    const currentTime = gazeInfo.timestamp;
    if (currentTime - lastTimestamp >= 1000) {
      setLastTimestamp(currentTime);
      console.log(`시선 좌표 : (${gazeInfo.x}, ${gazeInfo.y})`);
    }

    setGazeInfo(gazeInfo);

    const gazeX = gazeInfo.x;
    const gazeY = gazeInfo.y;
    const wordUnderGaze = wordPositions.find(({ x, y, width, height }) => {
      return gazeX >= x && gazeX <= x + width && gazeY >= y && gazeY <= y + height;
    });

    if (wordUnderGaze) {
      console.log("User is looking at:", wordUnderGaze.word);
    }
  };

  const showGazeDotOnDom = (gazeInfo: GazeInfo) => {
    const canvas = outputCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }
  };

  const hideGazeInfoOnDom = () => {
    if (gazeInfoRef.current) {
      gazeInfoRef.current.innerText = "";
    }
  };

  const hideGazeDotOnDom = () => {
    const canvas = outputCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const hideGaze = () => {
    hideGazeInfoOnDom();
    hideGazeDotOnDom();
  };

  // 디버그 콜백 함수
  const onDebug = (FPS: number, latency_min: number, latency_max: number, latency_avg: number) => {
    console.log("FPS:", FPS, "Latency (min/max/avg):", latency_min, latency_max, latency_avg);
  };

  // 캘리브레이션 버튼 클릭 핸들러
  const onClickCalibrationBtn = () => {
    const userId = "a1234";
    const redirectUrl = "https://k11d105.p.ssafy.io/fairytale/content/1";
    const calibrationPoint = 5;
    Seeso.openCalibrationPage(licenseKey ?? "", userId, redirectUrl, calibrationPoint);
  };

  // 쿼리 스트링에서 캘리브레이션 데이터 추출
  const parseCalibrationDataInQueryString = () => {
    const href = window.location.href;
    const decodedURI = decodeURI(href);
    const queryString = decodedURI.split("?")[1];
    if (!queryString) return undefined;
    const jsonString = queryString.slice("calibrationData=".length, queryString.length);
    return jsonString;
  };

  useEffect(() => {
    initSeeso();

    return () => {
      seeSoInstance?.stopTracking();
    };
  }, []);

  useEffect(() => {
    if (gazeInfo) {
      // 트래킹점 표시
      showGazeDotOnDom(gazeInfo);
    } else {
      hideGaze();
    }
  }, [gazeInfo]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <canvas id="output" ref={outputCanvasRef} style={{ position: "fixed", top: 0, left: 0 }}></canvas>
      <h1 style={{ textAlign: "center", zIndex: -1 }}>Calibration Service</h1>
      <h2 style={{ textAlign: "center" }}></h2>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}>
        <button onClick={onClickCalibrationBtn} style={{ margin: "0 auto" }}>
          Click me to use calibration service
        </button>
      </div>
    </div>
  );
};

export default SeesoComponent;
