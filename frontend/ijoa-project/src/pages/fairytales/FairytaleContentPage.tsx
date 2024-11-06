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
  const [toggleOptions, setToggleOptions] = useState([
    {
      label: "책 읽어주기",
      checked: localStorage.getItem("readAloudEnabled") !== null 
        ? localStorage.getItem("readAloudEnabled") === "true" 
        : true,
    },
    {
      label: "퀴즈",
      checked: localStorage.getItem("quizEnabled") !== null 
        ? localStorage.getItem("quizEnabled") === "true" 
        : true,
    },
    {
      label: "bgm",
      checked: localStorage.getItem("bgm") !== null 
        ? localStorage.getItem("bgm") === "true" 
        : true,
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      const isChildBgmPlaying = localStorage.getItem("bgm") === "true";
      const isQuizEnabled = localStorage.getItem("quizEnabled") === "true";
      const isReadAloudEnabled = localStorage.getItem("readAloudEnabled") === "true";

      setToggleOptions([
        { label: "책 읽어주기", checked: isReadAloudEnabled },
        { label: "퀴즈", checked: isQuizEnabled },
        { label: "bgm", checked: isChildBgmPlaying },
      ]);
      setIsLoaded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    toggleOptions.forEach((option) => {
      if (option.label === "bgm") {
        if (option.checked) {
          MusicManager.playChildBgm();
          localStorage.setItem("bgm", "true");
        } else {
          MusicManager.stopBgm();
          localStorage.setItem("bgm", "false");
        }
      }

      if (option.label === "퀴즈") {
        localStorage.setItem("quizEnabled", option.checked.toString());
        const quizToggleEvent = new CustomEvent("quizToggle", { detail: option.checked });
        window.dispatchEvent(quizToggleEvent);
      }

      if (option.label === "책 읽어주기") {
        localStorage.setItem("readAloudEnabled", option.checked.toString());
      }
    });
  }, [toggleOptions]);

  const handleToggle = (index: number) => {
    const newOptions = [...toggleOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setToggleOptions(newOptions);

    const option = newOptions[index];
    if (option.label === "bgm") {
      localStorage.setItem("bgm", option.checked.toString());
    } else if (option.label === "퀴즈") {
      localStorage.setItem("quizEnabled", option.checked.toString());
    } else if (option.label === "책 읽어주기") {
      localStorage.setItem("readAloudEnabled", option.checked.toString());
    }
  };

  const handleClose = () => {
    onClose();
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

        {/* 토글 컴포넌트 */}
        <SettingToggle options={toggleOptions} onToggle={handleToggle} />

        {/* 취소/완료 버튼 */}
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
