import { useEffect, useRef, useState } from "react";
import { parentApi } from "../../../api/parentApi";
import { TTSScriptInfo } from "../../../types/parentTypes";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../lottie/footPrint-loadingAnimation.json";

interface Props {
  setIsCreateModal: (state: boolean) => void;
}

const TTSCreateModal = ({ setIsCreateModal }: Props) => {
  const buttonStyle = "w-full px-8 py-2 text-xl font-bold rounded-xl border-2 ";
  const [scriptList, setScriptList] = useState<TTSScriptInfo[] | null>(null);
  const [scriptCurrentIdx, setScriptCurrentIdx] = useState(0);

  const [isRecording, setIsRecording] = useState(false); // 녹음 진행 상태 변수
  const [audioURL, setAudioURL] = useState<string | null>(null); // 오디오 미리 듣기를 위한 url 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // 녹음 제어를 위한 참조 변수
  const audioPlayRef = useRef<HTMLAudioElement | null>(null); // 오디오 재생을 위한 참조 변수
  const audioChunksRef = useRef<Blob[]>([]); // 오디오 저장을 위한 청크 배열(작은 데이터 조각) 참조 변수

  // 녹음 시작
  const startRecording = async () => {
    if (!isRecording) {
      // 기존 녹음 오디오 삭제
      setAudioURL(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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

  const handlePlayRecordingAudio = () => {
    audioPlayRef.current?.play();
  };

  useEffect(() => {
    getTTSScript();
  }, []);

  if (!scriptList) {
    return (
      <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
        <div className="w-1/2 p-10 bg-white rounded-2xl shadow-lg">
          <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
      <div className="w-1/2 p-10 bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img className="w-10 h-10" src="/assets/close-button.png" alt="" onClick={() => setIsCreateModal(false)} />
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* 안내 멘트 */}
          <div className="text-xl text-[#565656] text-center font-bold grid gap-5">
            <p className="underline underline-offset-1 decoration-8 decoration-[#67CCFF]">다음 문장을 녹음해주세요</p>
            <p>{scriptList[scriptCurrentIdx].script}</p>
          </div>

          <img className="w-32" src="/assets/parent/tts-mic-icon.png" alt="" />

          {/* 버튼 */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${buttonStyle} ${
                isRecording ? "text-white bg-[#FF8067] border-[#FF8067]" : "text-[#FF8067] border-[#FF8067]"
              }`}>
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </button>
            <button
              onClick={handlePlayRecordingAudio}
              disabled={!audioURL}
              className={`${buttonStyle} text-[#67CCFF] border-[#67CCFF] ${!audioURL ? "opacity-50" : ""}`}>
              결과 확인
            </button>
            <button
              disabled={isRecording || !audioURL}
              className={`${buttonStyle} text-white bg-[#67CCFF] border-[#67CCFF] ${
                isRecording || !audioURL ? "opacity-50" : ""
              }`}>
              다음
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
