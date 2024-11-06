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
import { fairyTaleApi } from "../../api/fairytaleApi";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData?: string;
  quizId?: number;
}

const animalImages = [Elephant, Fox, Giraffe, Hippo, Panda, Tiger, Zebra];

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, quizData = "", quizId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [animalImage, setAnimalImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsRecording(false);
      const randomAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
      setAnimalImage(randomAnimal);
    }
  }, [isOpen]);

  const handleRecording = () => {
    if (isRecording) {
      const childId = parseInt(localStorage.getItem("childId") || "0", 10);
      const fileName = 1;

      if (!quizId) return;
      submitQuizAnswer(childId, quizId, fileName);
      onClose();
    } else {
      setIsRecording(true);
    }
  };

  // 퀴즈 답변 등록 api 함수
  const submitQuizAnswer = async (childId: number, quizId: number, fileName: number) => {
    try {
      const response = await fairyTaleApi.submitQuizAnswer(childId, quizId, fileName);
      if (response.status === 200) {
        const { answerId, answerUrl } = response.data;
        console.log("퀴즈 답변 전송 성공", answerId, answerUrl);
      }
    } catch (error) {
      console.error("fairyTaleApi의 submitQuizAnswer : ", error);
    }
  };

  const splitTextIntoSentences = (quizData: string): string[] => {
    return quizData.split(/(?<=[.!?])\s+/);
  };

  const sentences: string[] = splitTextIntoSentences(quizData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center h-screen z-50">
      <div className="w-[700px] h-[450px] bg-white px-10 pb-10 rounded-2xl shadow-lg flex flex-col justify-center items-center relative">
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
