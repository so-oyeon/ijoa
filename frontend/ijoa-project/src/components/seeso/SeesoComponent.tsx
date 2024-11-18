import { useEffect, useRef, useState } from "react";
import Seeso, { UserStatusOption, InitializationErrorType } from "seeso";
import { GazeInfo, WordPositionInfo } from "../../types/seesoTypes";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface Props {
  fairytaleId: string;
  pageHistoryId: number;
  wordPositions: WordPositionInfo[];
  textRangePosition: WordPositionInfo;
  setIsFocusAlertModalOpen: (state: boolean) => void;
  setIsSeesoInitialized: (state: boolean) => void;
  isSeesoInitialized: boolean;
  isOpenSeesoSetting: boolean;
  setIsOpenSeesoSetting: (state: boolean) => void;
}

const SeesoComponent = ({
  fairytaleId,
  pageHistoryId,
  wordPositions,
  textRangePosition,
  setIsFocusAlertModalOpen,
  setIsSeesoInitialized,
  isSeesoInitialized,
  isOpenSeesoSetting,
  setIsOpenSeesoSetting,
}: Props) => {
  // 여유 범위
  const margin = 30;

  // Seeso 인스턴스를 관리하는 ref
  const seeSoInstanceRef = useRef<Seeso | null>(null);

  // 트래킹점 표시 관련 변수 (빨간점)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const gazeInfoRef = useRef<HTMLHeadingElement>(null);
  const wordPositionsRef = useRef(wordPositions);
  const textRangePositionRef = useRef(textRangePosition);
  const pageHistoryIdRef = useRef(pageHistoryId);

  // const [isSeesoInitialized, setIsSeesoInitialized] = useState(false); // 초기화 상태 관리
  const [gazeInfo, setGazeInfo] = useState<GazeInfo | null>(null);
  const isModalShownRef = useRef(false); // 모달 띄운 여부를 useRef로 관리
  const previousAttentionScoreRef = useRef(0);
  const isDropRef = useRef(false);

  const licenseKey = import.meta.env.VITE_SEESO_SDK_KEY;
  let seeSoInstance: Seeso | null = null;

  // SEESO 초기화
  const initSeeso = async () => {
    const calibrationData = parseCalibrationDataInQueryString();
    if (calibrationData && licenseKey) {
      seeSoInstance = new Seeso();
      seeSoInstanceRef.current = seeSoInstance;

      // UserStatusOption 객체 생성
      const userStatusOption = new UserStatusOption(true, false, false);
      const errorCode = await seeSoInstance.initialize(licenseKey, userStatusOption);

      if (errorCode === InitializationErrorType.ERROR_NONE) {
        setIsSeesoInitialized(true); // 초기화 성공 시 상태 업데이트

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
    if (attentionRate !== undefined) {
      // 증가 중일 때만 이전 값 저장
      if (previousAttentionScoreRef.current < attentionRate) {
        previousAttentionScoreRef.current = attentionRate;
      } else {
        isDropRef.current = true;
        // 감소 중일 때는 감소 변화값이 0.3 이상인지 확인
        if (!isModalShownRef.current && previousAttentionScoreRef.current - attentionRate > 0.3) {
          setIsFocusAlertModalOpen(true);
          previousAttentionScoreRef.current = attentionRate;
        }
      }
    }

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
    if (attentionRate === undefined || isNaN(attentionRate)) return;
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
    const data = {
      isGazeOutOfScreen: isNaN(gazeX) || isNaN(gazeY),
      attentionRate: attentionRate,
      word: word,
      isImage: isImage,
    };

    try {
      await fairyTaleApi.createEyeTrackingData(pageHistoryIdRef.current, data);
    } catch (error) {
      console.log("fairyTaleApi의 createEyeTrackingData : ", error);
    }
  };

  // SEESO 종료
  const handleRemoveSeeso = () => {
    const seeSoInstance = seeSoInstanceRef.current;
    if (seeSoInstance) {
      seeSoInstance.stopTracking(); // 트래킹 중지
      seeSoInstanceRef.current = null; // ref 초기화
    }
    setIsSeesoInitialized(false); // 상태 초기화
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

  useEffect(() => {
    if (isOpenSeesoSetting) {
      onClickCalibrationBtn();
      setIsOpenSeesoSetting(false);
    }
  }, [isOpenSeesoSetting]);

  return (
    <div>
      {/* 트래킹점 표시 관련 캔버스 (빨간점) */}
      {/* <canvas className="fixed top-0" id="output" ref={outputCanvasRef}></canvas> */}

      {/* 메뉴 버튼 */}
      <div className="absolute top-[-12px] left-10">
        <button
          className="px-3 py-4 bg-gray-700 bg-opacity-50 rounded-2xl shadow-md active:bg-gray-800 flex flex-col items-center space-y-2"
          onClick={isSeesoInitialized ? handleRemoveSeeso : onClickCalibrationBtn}
        >
          <div className="p-1 bg-white rounded-full">
            {isSeesoInitialized ? (
              <IoEyeOutline className="text-4xl text-yellow-500" />
            ) : (
              <IoEyeOffOutline className="text-4xl text-[#565656]" />
            )}
          </div>
          <p className="text-xs text-white">{isSeesoInitialized ? "집중도 분석 끄기" : "집중도 분석 켜기"}</p>
        </button>
      </div>
    </div>
  );
};

export default SeesoComponent;
