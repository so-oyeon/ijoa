import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";
import Elephant from "/assets/fairytales/images/elephant.png";
import Fox from "/assets/fairytales/images/fox.png";
import Giraffe from "/assets/fairytales/images/giraffe.png";
import Hippo from "/assets/fairytales/images/hippo.png";
import Panda from "/assets/fairytales/images/panda.png";
import Tiger from "/assets/fairytales/images/tiger.png";
import Zebra from "/assets/fairytales/images/zebra.png";
import Cloud from "/assets/fairytales/images/cloud.png";
// import Record from "/assets/fairytales/buttons/record.png";
import { fairyTaleApi } from "../../api/fairytaleApi";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/footPrint-loadingAnimation.json";

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
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioPlayRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [isLoadingSentences, setIsLoadingSentences] = useState(true);

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

  const startRecording = async () => {
    if (isRecording) return;

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
      setAudioBlob(audioBlob);

      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      waveSurferRef.current?.load(audioURL);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsRecorded(false);

    stream.getTracks().forEach(() => {
      waveSurferRef.current?.microphone?.start();
    });
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsRecorded(true);

      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
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
            onClose();
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
  }, [audioBlob]);

  useEffect(() => {
    if (isOpen) {
      setIsRecording(false);
      setIsRecorded(false);
      const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
      setAnimalImage(randomAnimal);
      setAudioBlob(null);
      setIsLoadingSentences(true);

      setTimeout(() => {
        setSentences(quizData ? quizData.split(/(?<=[.!?])\s+/) : []);
        setIsLoadingSentences(false);
      }, 1000); // 로딩 효과를 위해 임의의 지연 추가
    }
  }, [isOpen, quizData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center h-screen z-50 overflow-hidden">
      <div className="w-[700px] h-[450px] bg-white px-10 rounded-2xl shadow-lg flex flex-col justify-center items-center relative overflow-hidden">
        <button
          onClick={uploadAudioIfReady}
          disabled={!isRecorded}
          className={`absolute top-4 right-4 px-6 py-2 text-white font-bold rounded-full active:bg-yellow-600 ${
            isRecorded ? "bg-[#F7C548]" : "bg-[#F7C548] opacity-30"
          }`}
        >
          답변 저장
        </button>

        <div className="flex items-center gap-8">
          <img src={animalImage} alt="Animal Character" className="w-[300px] h-auto mt-10" />
          <div className="relative w-full text-center">
            <img src={Cloud} alt="말풍선" className="w-[400px] mx-auto relative z-10" />
            <span className="w-[280px] absolute ml-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fairytale-font z-20 flex flex-col items-center">
              {isLoadingSentences ? (
                <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
              ) : (
                <div>
                  {sentences.map((quiz, index) => (
                    <p key={index} className="text-lg flex justify-center px-6 break-keep">
                      {quiz}
                    </p>
                  ))}
                </div>
              )}
            </span>
          </div>
        </div>

        <div ref={waveformContainerRef} className="absolute bottom-36 w-64 h-2 left-0 right-0 mx-auto"></div>
        <div className="absolute bottom-5 justify-center flex">
          <button
            onClick={handleRecording}
            className={`px-6 py-2 text-white font-bold rounded-full ${
              isRecording ? "bg-[#FF8067] active:bg-red-500" : "bg-[#0AC574] active:bg-green-700"
            }`}
          >
            {isRecording ? "녹음 완료" : "녹음 시작"}
          </button>
        </div>

        {audioURL && <audio controls src={audioURL} className="hidden" ref={audioPlayRef}></audio>}
      </div>
    </div>
  );
};

export default QuizModal;
