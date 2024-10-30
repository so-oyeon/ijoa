import React, { useState, useEffect } from "react";
import Elephant from "/assets/fairytales/images/elephant.png";
import Fox from "/assets/fairytales/images/fox.png";
import Giraffe from "/assets/fairytales/images/giraffe.png";
import Hippo from "/assets/fairytales/images/hippo.png";
import Panda from "/assets/fairytales/images/panda.png";
import Tiger from "/assets/fairytales/images/tiger.png";
import Zebra from "/assets/fairytales/images/zebra.png";
import Cloud from "/assets/fairytales/images/cloud.png";
import Record from "/assets/fairytales/buttons/record.png";

interface QuizModalProps {
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // 모달 닫기 함수
}

// 동물 이미지 배열
const animalImages = [Elephant, Fox, Giraffe, Hippo, Panda, Tiger, Zebra];
// 모달에 표시할 텍스트
const text: string =
  "거북이가 심청이를 도와줬대! 태하는 바다에 살고 있는 동물 중에 누가 태하를 도와줬으면 좋겠어? 큰 소리로 또박또박 말해줘!";

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [animalImage, setAnimalImage] = useState("");

  // 모달이 열릴 때 동물 이미지를 랜덤으로 설정
  useEffect(() => {
    if (isOpen) {
      setIsRecording(false); // 녹음 상태 초기화
      const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
      setAnimalImage(randomAnimal); // 랜덤 동물 이미지 설정
    }
  }, [isOpen]);

  // 녹음 버튼 클릭 핸들러
  const handleRecording = () => {
    if (isRecording) {
      onClose(); // 녹음 중이면 모달 닫기
    } else {
      setIsRecording(true); // 녹음 시작
    }
  };

  // 텍스트를 문장 단위로 나누는 함수
  const splitTextIntoSentences = (text: string): string[] => {
    return text.split(/(?<=[.!?])\s+/); // 문장 단위로 나누기
  };

  const sentences: string[] = splitTextIntoSentences(text); // 나눈 문장 배열

  // 모달이 열리지 않으면 null 반환
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center h-screen z-50">
      <div className="w-[700px] h-[450px] bg-white px-10 pb-10 rounded-3xl shadow-lg flex flex-col justify-center items-center relative">
        <div className="flex items-center gap-8">
          <img src={animalImage} alt="Animal Character" className="w-[300px] h-auto mt-10" />
          <div className="relative w-full text-center">
            <img src={Cloud} alt="말풍선" className="w-[400px] mx-auto relative z-10" />
            <span className="w-[280px] absolute ml-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fairytale-font z-20 flex flex-col items-center">
              <img src={Record} alt="녹음 버튼" className="mb-2" />
              <div>
                {sentences.map((sentence, index) => (
                  <p key={index} className="text-lg">
                    {sentence}
                  </p>
                ))}
              </div>
            </span>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <button
            onClick={handleRecording}
            className={`px-6 py-2 text-white font-bold rounded-full ${isRecording ? "bg-[#FF8067]" : "bg-[#0AC574]"}`}
          >
            {isRecording ? "녹음 완료" : "녹음 시작"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
