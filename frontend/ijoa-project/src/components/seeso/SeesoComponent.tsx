import { useEffect, useRef, useState } from "react";
import Seeso, { UserStatusOption, InitializationErrorType } from "seeso";
import { GazeInfo, WordPositionInfo } from "../../types/seesoTypes";
import { fairyTaleApi } from "../../api/fairytaleApi";

interface Props {
  fairytaleId: string;
  pageHistoryId: number;
  wordPositions: WordPositionInfo[];
  textRangePosition: WordPositionInfo;
}

const SeesoComponent = ({ fairytaleId, pageHistoryId, wordPositions, textRangePosition }: Props) => {
  // 여유 범위
  const margin = 30;

  // 트래킹점 표시 관련 변수 (빨간점)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const gazeInfoRef = useRef<HTMLHeadingElement>(null);
  const wordPositionsRef = useRef(wordPositions);
  const textRangePositionRef = useRef(textRangePosition);
  const pageHistoryIdRef = useRef(pageHistoryId);

  const [gazeInfo, setGazeInfo] = useState<GazeInfo | null>(null);

  const licenseKey = import.meta.env.VITE_SEESO_SDK_KEY;
  let seeSoInstance: Seeso | null = null;

  // SEESO 초기화
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

        seeSoInstance?.addGazeCallback(onGaze);
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
    // 트래킹점 표시 셋팅 (빨간점)
    setGazeInfo(gazeInfo);

    // 시선 좌표 추출
    const gazeX = gazeInfo.x;
    const gazeY = gazeInfo.y;

    // 집중도 추출
    const attentionRate = seeSoInstance?.getAttentionScore();

    // 단어 추출 (만족하는 요소 없을 시, undefined 반환)
    const wordUnderGaze = wordPositionsRef.current.find(({ x, y, width, height }) => {
      return gazeX >= x && gazeX <= x + width && gazeY >= y && gazeY <= y + height;
    });

    // 글 또는 그림 여부 추출
    const textRange = textRangePositionRef.current;
    let isImage = false;
    // 집중 안할 경우
    if (isNaN(gazeX) || isNaN(gazeY)) {
      isImage = false;
    }
    // 글 보고 있을 경우
    else if (
      gazeX >= textRange.x - margin &&
      gazeX <= textRange.x + textRange.width + margin &&
      gazeY >= textRange.y - margin &&
      gazeY <= textRange.y + textRange.height + margin
    ) {
      isImage = false;
    }
    // 그림 보고 있을 경우
    else {
      isImage = true;
    }

    // 시선추적 데이터 저장 api 호출
    if (attentionRate === undefined) return;
    handleSaveEyeTrackingData(
      gazeX,
      gazeY,
      attentionRate,
      wordUnderGaze === undefined ? null : wordUnderGaze.word,
      isImage
    );
  };

  // 트래킹점 표시 관련 함수 (빨간점)
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
    const redirectUrl = `http://localhost:5173/fairytale/content/${fairytaleId}`; // seeso 초기화 후 리다이렉트 주소
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

  // 동화책 특정 페이지 시선추적 데이터 저장 통신 함수
  const handleSaveEyeTrackingData = async (
    gazeX: number,
    gazeY: number,
    attentionRate: number,
    word: string | null, // 단어 정보 없으면 null
    isImage: boolean
  ) => {
    // 현재 년-월-일T시:분:초.밀리초Z 추출
    const today = new Date();
    const formatToday = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}T${today.getHours()}:${today.getMinutes()}:${today
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${today.getMilliseconds().toString().padStart(3, "0")}Z`;

    const data = {
      trackedAt: formatToday,
      isFaceMissing: !(isNaN(gazeX) || isNaN(gazeY)),
      gazeX: isNaN(gazeX) ? null : gazeX,
      gazeY: isNaN(gazeY) ? null : gazeY,
      attentionRate: isNaN(attentionRate) ? null : attentionRate,
      word: word,
      isImage: isImage,
    };

    try {
      const response = await fairyTaleApi.createEyeTrackingData(pageHistoryIdRef.current, data);
      if (response.status === 201) {
        console.log(response);
      }
    } catch (error) {
      console.log("fairyTaleApi의 createEyeTrackingData : ", error);
    }
  };

  useEffect(() => {
    initSeeso();

    return () => {
      seeSoInstance?.stopTracking();
    };
  }, []);

  // 트래킹점 표시 관련 useEffect (빨간점)
  useEffect(() => {
    if (gazeInfo) {
      // 트래킹점 표시
      showGazeDotOnDom(gazeInfo);
    } else {
      // 트래킹점 제거
      hideGaze();
    }
  }, [gazeInfo]);

  useEffect(() => {
    wordPositionsRef.current = wordPositions;
  }, [wordPositions]);

  useEffect(() => {
    textRangePositionRef.current = textRangePosition;
  }, [textRangePosition]);

  useEffect(() => {
    pageHistoryIdRef.current = pageHistoryId;
  }, [pageHistoryId]);

  return (
    <div>
      {/* 트래킹점 표시 관련 캔버스 (빨간점) */}
      {/* <canvas className="fixed top-0" id="output" ref={outputCanvasRef}></canvas> */}

      {/* 단어 위치에 따라 빨간색 테두리 박스 div 표시 */}
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

      {/* 텍스트 박스 범위에 따라 빨간색 테두리 박스 div 표시 */}
      {/* <div
        style={{
          position: "absolute",
          left: `${textRangePosition.x - margin}px`,
          top: `${textRangePosition.y - margin}px`,
          width: `${textRangePosition.width + margin * 2}px`,
          height: `${textRangePosition.height + margin * 2}px`,
          border: "2px solid #FF0000", // 반투명 흰색
          pointerEvents: "none", // 클릭 이벤트 무시
          zIndex: 10,
        }}></div> */}

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
