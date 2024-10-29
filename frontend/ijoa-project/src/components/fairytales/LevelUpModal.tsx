import React from "react";
import firework from "/assets/fairytales/images/fireworks.png";
import firework2 from "/assets/fairytales/images/fireworks2.png";
import Animals2 from "/assets/fairytales/images/animals2.png";

interface LevelUpModalProps {
  isOpen: boolean;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 text-center bg-white rounded-3xl shadow-lg">
        <div className="px-4 py-8">
          <div className="mb-10 flex justify-center items-center gap-36">
            <img src={firework} alt="불꽃놀이" />
            <img src={firework2} alt="불꽃놀이2" />
          </div>
          <div className="mb-8 text-2xl font-bold text-center fairytale-font whitespace-pre-line">
            {"와~ 한 단계 성장했어요!\n나는야 책아장 🙌"}
          </div>
        </div>
        <img src={Animals2} alt="동물들" className="w-full" />
      </div>
    </div>
  );
};

export default LevelUpModal;
