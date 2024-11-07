import React, { useState, useEffect, useRef } from "react";
import Elephant from "/assets/fairytales/images/elephant.png";
import Fox from "/assets/fairytales/images/fox.png";
import Giraffe from "/assets/fairytales/images/giraffe.png";
import Hippo from "/assets/fairytales/images/hippo.png";
import Panda from "/assets/fairytales/images/panda.png";
import Tiger from "/assets/fairytales/images/tiger.png";
import Zebra from "/assets/fairytales/images/zebra.png";
import Cloud from "/assets/fairytales/images/cloud.png";
import Record from "/assets/fairytales/buttons/record.png";
import { fairyTaleApi } from "../../api/fairytaleApi";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData?: string;
  quizId?: number;
}

const animalImages = [Elephant, Fox, Giraffe, Hippo, Panda, Tiger, Zebra];

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, quizData = "", quizId }) => {
  const childId = localStorage.getItem("childId");
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [animalImage, setAnimalImage] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null); // 오디오 미리 듣기를 위한 url 변수
  const audioPlayRef = useRef<HTMLAudioElement | null>(null); // 오디오 재생을 위한 참조 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (isRecording) return; // 이미 녹음 중이면 리턴

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
      setAudioBlob(audioBlob); // Blob이 생성되면 setAudioBlob 호출
      console.log("녹음이 종료되었습니다.");

      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsRecorded(false);
    console.log("녹음이 시작되었습니다.");
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false); // 녹음 중지 후 상태 업데이트
      setIsRecorded(true);
    } else {
      console.log("녹음이 시작되지 않았습니다.");
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const uploadAudioIfReady = async () => {
    if (audioBlob && childId && quizId && !isRecording) {
      try {
        const fileName = `${Date.now()}_${childId}_${quizId}.wav`;
        const response = await fairyTaleApi.submitQuizAnswer(Number(childId), quizId, fileName);

        if (response.status === 200 && response.data.answerUrl) {
          const presignedUrl = response.data.answerUrl;
          const uploadSuccess = await uploadAudioToS3(presignedUrl, audioBlob);

          if (uploadSuccess) {
            console.log("Audio uploaded successfully!");
            onClose(); // 모달 닫기
          } else {
            console.error("Audio upload failed.");
          }
        }
      } catch (error) {
        console.error("Error during S3 upload:", error);
      }
    }
  };

  const uploadAudioToS3 = async (presignedUrl: string, file: Blob) => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });
      return response.ok;
    } catch (error) {
      console.error("Error uploading audio:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!audioBlob || isRecording) return;

    console.log(audioBlob);
  }, [audioBlob]);

  useEffect(() => {
    if (isOpen) {
      setIsRecording(false);
      setIsRecorded(false);
      const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
      setAnimalImage(randomAnimal);
      setAudioBlob(null);
    }
  }, [isOpen]);

  const splitTextIntoSentences = (quizData: string): string[] => {
    return quizData.split(/(?<=[.!?])\s+/);
  };

  const sentences: string[] = splitTextIntoSentences(quizData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center h-screen z-50">
      <div className="w-[700px] h-[450px] bg-white px-10 pb-10 rounded-2xl shadow-lg flex flex-col justify-center items-center relative">
        {/* 오른쪽 상단의 답변 저장 버튼 */}
        <button
          onClick={uploadAudioIfReady}
          disabled={!isRecorded} // 녹음 완료 후에만 활성화
          className={`absolute top-4 right-4 px-6 py-2 text-white font-bold rounded-full ${
            isRecorded ? "bg-[#F7C548]" : "bg-[#F7C548] opacity-30" // 녹음 완료 시 활성화, 그렇지 않으면 비활성화
          }`}
        >
          답변 저장
        </button>

        <div className="flex items-center gap-8">
          <img src={animalImage} alt="Animal Character" className="w-[300px] h-auto mt-10" />
          <div className="relative w-full text-center">
            <img src={Cloud} alt="말풍선" className="w-[400px] mx-auto relative z-10" />
            <span className="w-[280px] absolute ml-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fairytale-font z-20 flex flex-col items-center">
              <img src={Record} alt="녹음 버튼" className="mb-2" />
              <div>
                {sentences.map((quiz, index) => (
                  <p key={index} className="text-lg">
                    {quiz}
                  </p>
                ))}
              </div>
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 justify-center flex">
          <button
            onClick={handleRecording}
            className={`px-6 py-2 text-white font-bold rounded-full ${isRecording ? "bg-[#FF8067]" : "bg-[#0AC574]"}`}
          >
            {isRecording ? "녹음 완료" : "녹음 시작"}
          </button>
        </div>

        {/* 오디오 재생 컨트롤바 */}
        {audioURL && <audio controls src={audioURL} className="hidden" ref={audioPlayRef}></audio>}
      </div>
    </div>
  );
};

export default QuizModal;
