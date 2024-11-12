import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import Animals2 from "/assets/fairytales/images/animals2.png";

interface LevelUpModalProps {
  isOpen: boolean;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      firework(); // 모달이 열리면 폭죽 효과 실행
    }
  }, [isOpen]);

  const firework = () => {
    const duration = 20 * 100; // 폭죽 지속 시간
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 10, spread: 360, ticks: 50, zIndex: 50 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center bg-white rounded-2xl shadow-lg mx-4">
        <div className="px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl font-bold text-center fairytale-font whitespace-pre-line">
            {"와~ 한 단계 성장했어요!\n나는야 책아장 🙌"}
          </div>
        </div>
        <img src={Animals2} alt="동물들" className="w-full h-auto rounded-b-2xl" />
      </div>
    </div>
  );
};

export default LevelUpModal;
