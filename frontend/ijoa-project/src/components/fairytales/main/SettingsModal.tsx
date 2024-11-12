import React, { useEffect, useState } from "react";
import SettingToggle from "./SettingToggle";
import SettingsIcon from "/assets/fairytales/buttons/settings-icon.png";
import MusicManager from "../../../MusicManager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialToggleOptions, setInitialToggleOptions] = useState<{ label: string; checked: boolean }[]>([]);

  const [toggleOptions, setToggleOptions] = useState<{ label: string; checked: boolean }[]>(() => [
    { label: "책 읽어주기", checked: localStorage.getItem("readAloudEnabled") === "true" || false },
    { label: "퀴즈", checked: localStorage.getItem("quizEnabled") === "true" || false },
    { label: "bgm", checked: localStorage.getItem("bgm") === "true" || false },
  ]);

  useEffect(() => {
    if (isOpen && !isLoaded) {
      const initialOptions = [
        { label: "책 읽어주기", checked: localStorage.getItem("readAloudEnabled") === "true" || false },
        { label: "퀴즈", checked: localStorage.getItem("quizEnabled") === "true" || false },
        { label: "bgm", checked: localStorage.getItem("bgm") === "true" || false },
      ];
      setInitialToggleOptions(initialOptions); // 초기 상태 저장
      setToggleOptions(initialOptions);
      setIsLoaded(true);
    }
  }, [isOpen, isLoaded]);

  const handleToggle = (index: number) => {
    const newOptions = [...toggleOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setToggleOptions(newOptions);
  };

  const handleCancel = () => {
    setToggleOptions(initialToggleOptions); // 초기 상태로 복원
    handleClose();
  };

  const handleSave = () => {
    toggleOptions.forEach((option) => {
      if (option.label === "bgm") {
        if (option.checked) {
          MusicManager.playChildBgm();
          localStorage.setItem("bgm", "true");
        } else {
          MusicManager.stopBgm();
          localStorage.setItem("bgm", "false");
        }
      } else if (option.label === "퀴즈") {
        localStorage.setItem("quizEnabled", option.checked.toString());
        const quizToggleEvent = new CustomEvent("quizToggle", { detail: option.checked });
        window.dispatchEvent(quizToggleEvent);
      } else if (option.label === "책 읽어주기") {
        localStorage.setItem("readAloudEnabled", option.checked.toString());
      }
    });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setIsLoaded(false); // 모달이 닫힐 때 로드 상태 초기화
  };

  if (!isOpen || !isLoaded) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-[300px] md:w-[400px] py-6 sm:py-8 text-center bg-white rounded-2xl shadow-lg mx-4">
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <img src={SettingsIcon} alt="설정 아이콘" className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
          <span className="blue-highlight">기본 설정</span>을 선택해 주세요.
        </div>

        <SettingToggle options={toggleOptions} onToggle={handleToggle} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
          <button
            onClick={handleCancel}
            className="w-32 px-6 py-2 sm:px-8 text-[#67CCFF] text-base sm:text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-32 px-6 py-2 sm:px-8 text-white text-base sm:text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99]"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
