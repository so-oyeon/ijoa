import { useEffect, useRef, useState } from "react";
import Seeso, { UserStatusOption, InitializationErrorType } from "seeso";
import { GazeInfo, WordPositionInfo } from "../../types/seesoTypes";

interface Props {
  wordPositions: WordPositionInfo[];
}

const SeesoComponent = ({ wordPositions }: Props) => {
  // 트래킹점 표시 관련 변수 (빨간점)
  // const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  // const gazeInfoRef = useRef<HTMLHeadingElement>(null);
  const wordPositionsRef = useRef(wordPositions);

  // const [gazeInfo, setGazeInfo] = useState<GazeInfo | null>(null);
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
          // console.log("Attention Score: ", seeSoInstance?.getAttentionScore());
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
    // console.log(wordPositionsRef.current);

    const currentTime = gazeInfo.timestamp;
    if (currentTime - lastTimestamp >= 1000) {
      setLastTimestamp(currentTime);

      const gazeX = gazeInfo.x;
      const gazeY = gazeInfo.y;

      // console.log(`시선 좌표 : (${gazeX}, ${gazeY})`);
      const wordUnderGaze = wordPositionsRef.current.find(({ x, y, width, height }) => {
        // console.log(`gazeX: ${gazeX}, gazeY: ${gazeY}, x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
        return gazeX >= x && gazeX <= x + width && gazeY >= y && gazeY <= y + height;
      });

      if (wordUnderGaze) {
        console.log("내가 본 단어:", wordUnderGaze.word);
      }
    }

    // 트래킹점 표시 셋팅 (빨간점)
    // setGazeInfo(gazeInfo);
  };

  // 트래킹점 표시 관련 함수 (빨간점)
  // const showGazeDotOnDom = (gazeInfo: GazeInfo) => {
  //   const canvas = outputCanvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       canvas.width = window.innerWidth;
  //       canvas.height = window.innerHeight;
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       ctx.fillStyle = "#FF0000";
  //       ctx.beginPath();
  //       ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
  //       ctx.fill();
  //     }
  //   }
  // };

  // const hideGazeInfoOnDom = () => {
  //   if (gazeInfoRef.current) {
  //     gazeInfoRef.current.innerText = "";
  //   }
  // };

  // const hideGazeDotOnDom = () => {
  //   const canvas = outputCanvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     }
  //   }
  // };

  // const hideGaze = () => {
  //   hideGazeInfoOnDom();
  //   hideGazeDotOnDom();
  // };

  // 디버그 콜백 함수
  const onDebug = (FPS: number, latency_min: number, latency_max: number, latency_avg: number) => {
    console.log("FPS:", FPS, "Latency (min/max/avg):", latency_min, latency_max, latency_avg);
  };

  // 캘리브레이션 버튼 클릭 핸들러
  const onClickCalibrationBtn = () => {
    const userId = "a1234";
    const redirectUrl = "http://localhost:5173/fairytale/content/1"; // seeso 초기화 후 리다이렉트 주소
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

  // 트래킹점 표시 관련 useEffect (빨간점)
  // useEffect(() => {
  //   if (gazeInfo) {
  //     // 트래킹점 표시
  //     showGazeDotOnDom(gazeInfo);
  //   } else {
  //     // 트래킹점 제거
  //     hideGaze();
  //   }
  // }, [gazeInfo]);

  useEffect(() => {
    wordPositionsRef.current = wordPositions;
  }, [wordPositions]);

  return (
    <div>
      {/* 트래킹점 표시 관련 캔버스 (빨간점) */}
      {/* <canvas className="fixed top-0" id="output" ref={outputCanvasRef}></canvas> */}

      {/* 단어 위치에 따라 배경이 흰색인 div 표시 */}
      {/* {wordPositions.map((position, index) =>
        index >= 0 ? (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${position.width}px`,
              height: `${position.height}px`,
              border: "2px solid #FF0000", // 반투명 흰색
              pointerEvents: "none", // 클릭 이벤트 무시
              zIndex: 10,
            }}></div>
        ) : (
          <></>
        )
      )} */}

      <div className="p-3 bg-white rounded-xl grid place-content-center    fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
        <p>집중도 분석을 위해 아이트래킹을 설정해주세요 !</p>
        <button className="bg-yellow-300" onClick={onClickCalibrationBtn}>
          아이트래킹 설정 바로가기 click!
        </button>
      </div>
    </div>
  );
};

export default SeesoComponent;
