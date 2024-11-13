import { useEffect, useRef, useState } from "react";
import { parentApi } from "../../../api/parentApi";
import { S3UrlInfo, TTSScriptInfo } from "../../../types/parentTypes";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";

interface Props {
  setIsCreateModal: (state: boolean) => void;
  ttsId: number;
  getParentTTSList: () => void;
}

const TTSCreateModal = ({ setIsCreateModal, ttsId, getParentTTSList }: Props) => {
  const buttonStyle = "w-full px-8 py-2 text-xl rounded-xl border-2 ";
  const [scriptList, setScriptList] = useState<TTSScriptInfo[] | null>(null);
  const [scriptCurrentIdx, setScriptCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false); // 녹음 진행 상태 변수
  const [isLoadingBySaveAudioToS3, setIsLoadingBySaveAudioToS3] = useState(false);

  const [audioURL, setAudioURL] = useState<string | null>(null); // 오디오 미리 듣기를 위한 url 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // 녹음 제어를 위한 참조 변수
  const audioPlayRef = useRef<HTMLAudioElement | null>(null); // 오디오 재생을 위한 참조 변수
  const audioChunksRef = useRef<Blob[]>([]); // 오디오 저장을 위한 청크 배열(작은 데이터 조각) 참조 변수
  const [recordingList, setRecordingList] = useState<Blob[]>([]); // 전체 녹음본 목록

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);

  const [S3UrlList, setS3UrlList] = useState<S3UrlInfo[] | null>(null); // 전체 녹음본 목록

  // 음성 그래프 표시
  const initializeWaveSurfer = () => {
    if (!waveformContainerRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
      container: waveformContainerRef.current,
      waveColor: "#D9DCFF",
      progressColor: "#4353FF",
      cursorWidth: 0,
      interact: false,
      plugins: [
        MicrophonePlugin.create({
          bufferSize: 4096,
          sampleRate: 44100,
          mediaStreamConstraints: {
            audio: true,
          },
        }),
      ],
    });
  };

  // 녹음 시작
  const startRecording = async () => {
    if (!isRecording) {
      // 기존 녹음 오디오 삭제
      setAudioURL(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      initializeWaveSurfer();
      waveSurferRef.current?.microphone?.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

        // 현재 스크립트 인덱스 위치에 녹음본 추가 (덮어쓰기)
        setRecordingList((prev) => {
          const updatedRecordings = [...prev];
          updatedRecordings[scriptCurrentIdx] = audioBlob;
          return updatedRecordings;
        });

        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
      };

      mediaRecorder.start();
      setIsRecording(true);

      stream.getTracks().forEach(() => {
        waveSurferRef.current?.microphone?.start();
      });
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
    }
  };

  // 녹음본 자동 재생 함수
  const handlePlayRecordingAudio = () => {
    audioPlayRef.current?.play();
  };

  // TTS 녹음 스크립트 목록 조회 통신 함수
  const getTTSScript = async () => {
    try {
      const response = await parentApi.getTTSScriptList();
      if (response.status === 200) {
        setScriptList(response.data);
      }
    } catch (error) {
      console.log("parentApi의 getTTSScriptList : ", error);
    }
  };

  // 다음 스크립트로 이동 함수
  const handleNextRecording = () => {
    // 다음 스크립트로 전환
    setScriptCurrentIdx((prev) => prev + 1);

    // 다음 녹음으로 넘어갈 때 현재 녹음 URL 초기화
    setAudioURL(null);
  };

  // 녹음 완료 후 오디오 저장 s3 url 목록 조회 통신 함수
  const handleCompleteRecording = async () => {
    const temp = Array.from(Array(scriptList?.length), (_, index) => ({
      fileName: `audio${index + 1}.wav`,
      scriptId: index + 1,
    }));
    const data = {
      fileScriptPairs: temp,
    };

    try {
      const response = await parentApi.getTTSFileStorageUrlList(ttsId, data);
      if (response.status === 201) {
        setS3UrlList(response.data);
      }
    } catch (error) {
      console.log("parentApi의 getTTSFileStorageUrlList : ", error);
    }
  };

  // S3에 단일 녹음본을 저장하는 통신 함수
  const handleSaveAudioToS3 = async (presignedUrl: string, file: Blob) => {
    setIsLoadingBySaveAudioToS3(true);
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });
      if (response.ok) {
        console.log("파일 업로드 성공:", presignedUrl);
      } else {
        console.warn("파일 업로드 실패:", presignedUrl);
      }
      return response.ok;
    } catch (error) {
      console.error("파일 업로드 중 에러 발생:", error);
      return false;
    } finally {
      setIsLoadingBySaveAudioToS3(false);
    }
  };

  // S3에 전체 녹음본을 저장하는 통신 함수
  const handleAllSaveAudioToS3 = async () => {
    if (!S3UrlList) return;

    try {
      const uploadPromises = S3UrlList.map((item, index) => handleSaveAudioToS3(item.url, recordingList[index]));

      const results = await Promise.all(uploadPromises);
      const allUploadsSuccessful = results.every((result) => result);

      if (allUploadsSuccessful) {
        handleTrainTTS();
      } else {
        alert("일부 파일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류가 발생했습니다:", error);
      alert("파일 업로드 중 에러가 발생했습니다.");
    }
  };

  // 녹음한 음성파일로 TTS 학습을 시작합니다.
  const handleTrainTTS = async () => {
    try {
      const response = await parentApi.getTrainTTS(ttsId);
      if (response.status === 200) {
        getParentTTSList();
        setIsCreateModal(false);
      }
    } catch (error) {
      console.log("parentApi의 getTrainTTS : ", error);
    }
  };

  // 페이지 렌더링 시, TTS 스크립트 목록 조회
  useEffect(() => {
    getTTSScript();
  }, []);

  // scriptList가 업데이트되면 recordings 배열을 scriptList의 길이에 맞게 초기화
  useEffect(() => {
    if (scriptList) {
      setRecordingList(Array(scriptList.length).fill(null));
    }
  }, [scriptList]);

  // S3Url 통신 성공 후 S3에 등록
  useEffect(() => {
    if (!S3UrlList) return;

    handleAllSaveAudioToS3();
  }, [S3UrlList]);

  if (!scriptList || isLoadingBySaveAudioToS3) {
    return (
      <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
        <div className="w-1/2 p-10 bg-white rounded-2xl shadow-lg flex justify-center items-center">
          <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50  font-['MapleLight']">
      <div className="w-1/2 p-10 bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img className="w-10 h-10" src="/assets/close-button.png" alt="" onClick={() => setIsCreateModal(false)} />
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* 안내 멘트 */}
          <div className="text-[#565656] text-center font-bold grid gap-5">
            <div className="text-2xl">
              <span className="underline underline-offset-1 decoration-8 decoration-[#67CCFF]">
                다음 문장을 녹음해주세요
              </span>
              <span>
                &nbsp;({scriptCurrentIdx + 1} / {scriptList.length})
              </span>
            </div>
            <p className="text-xl break-keep">{scriptList[scriptCurrentIdx].script}</p>
          </div>

          <img className="w-32" src="/assets/parent/tts-mic-icon.png" alt="" />

          {/* 음성 그래프 */}
          <div ref={waveformContainerRef} className="w-64 h-2 relative -top-40"></div>

          {/* 버튼 */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${buttonStyle} ${
                isRecording
                  ? "text-white bg-[#FF8067] border-[#FF8067] active:bg-red-300"
                  : "text-[#FF8067] border-[#FF8067] active:bg-red-500 active:text-white"
              }`}>
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </button>
            <button
              onClick={handlePlayRecordingAudio}
              disabled={!audioURL}
              className={`${buttonStyle} text-[#67CCFF] border-[#67CCFF] ${
                !audioURL ? "opacity-50" : "active:bg-[#e0f7ff]"
              }`}>
              결과 확인
            </button>
            <button
              onClick={scriptCurrentIdx + 1 === scriptList.length ? handleCompleteRecording : handleNextRecording}
              disabled={isRecording || !audioURL}
              className={`${buttonStyle} text-white bg-[#67CCFF] border-[#67CCFF] ${
                isRecording || !audioURL ? "opacity-50" : "active:bg-[#005f99]"
              }`}>
              {scriptCurrentIdx + 1 === scriptList.length ? "완료" : "다음"}
            </button>
          </div>

          {/* 오디오 재생 컨트롤바 */}
          {audioURL && <audio controls src={audioURL} className="hidden" ref={audioPlayRef}></audio>}
        </div>
      </div>
    </div>
  );
};

export default TTSCreateModal;
