import React, { useEffect, useState } from "react";
import SettingToggle from "../../components/fairytales/SettingToggle";
import SettingsIcon from "/assets/fairytales/buttons/settings-icon.png";
import MusicManager from "../../MusicManager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드 시 localStorage에서 설정 값을 불러오기
  const [toggleOptions, setToggleOptions] = useState<{ label: string; checked: boolean }[]>(() => [
    { label: "책 읽어주기", checked: localStorage.getItem("readAloudEnabled") === "true" || false },
    { label: "퀴즈", checked: localStorage.getItem("quizEnabled") === "true" || false },
    { label: "bgm", checked: localStorage.getItem("bgm") === "true" || false },
  ]);

  useEffect(() => {
    if (isOpen && !isLoaded) {
      // 설정이 로드되지 않은 상태에서만 localStorage 값을 반영하여 초기화
      setToggleOptions((prevOptions) =>
        prevOptions.map((option) => {
          const storedValue = localStorage.getItem(option.label === "퀴즈" ? "quizEnabled" : option.label);
          if (storedValue !== null) {
            return { ...option, checked: storedValue === "true" };
          }
          return { ...option, checked: true }; // 기본값을 true로 설정
        })
      );
      setIsLoaded(true);
    }
  }, [isOpen, isLoaded]);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [toggleOptions, isOpen]);

  const handleToggle = (index: number) => {
    const newOptions = [...toggleOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setToggleOptions(newOptions);

    // toggle 변경 시 바로 localStorage에 업데이트
    const optionLabel = newOptions[index].label;
    localStorage.setItem(optionLabel === "퀴즈" ? "quizEnabled" : optionLabel, newOptions[index].checked.toString());
  };

  const handleClose = () => {
    onClose();
    setIsLoaded(false); // 모달이 닫힐 때 로드 상태 초기화
  };

  if (!isOpen || !isLoaded) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-1/3 py-8 text-center bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <img src={SettingsIcon} alt="설정 아이콘" className="w-12 h-12" />
        </div>
        <div className="text-xl font-bold">
          <span className="blue-highlight">기본 설정</span>을 선택해 주세요.
        </div>

        <SettingToggle options={toggleOptions} onToggle={handleToggle} />

        <div className="flex gap-4 justify-center items-center">
          <button
            onClick={handleClose}
            className="mt-6 px-8 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF]"
          >
            취소
          </button>
          <button
            onClick={handleClose}
            className="mt-6 px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
