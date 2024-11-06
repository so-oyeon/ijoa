interface Props {
  setIsCreateCompleted: (state: boolean) => void;
  setIsCreateGuideModal: (state: boolean) => void;
}

const TTSCreateCompleteModal = ({ setIsCreateCompleted, setIsCreateGuideModal }: Props) => {
  const handleCreateTTS = () => {
    setIsCreateCompleted(false);
    setIsCreateGuideModal(true);
  };

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
      <div className="w-1/3 px-10 py-10 bg-white rounded-2xl shadow-lg flex flex-col justify-between items-center">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img
            className="w-10 h-10"
            src="/assets/close-button.png"
            alt=""
            onClick={() => setIsCreateCompleted(false)}
          />
        </div>

        <div className="w-full flex flex-col justify-between items-center space-y-8">
          {/* 타이틀 텍스트 */}
          <div className="text-2xl text-center font-bold flex flex-col space-y-2">
            <p>TTS 프로필을</p>
            <p>생성했어요!</p>
          </div>

          <img className="w-14 aspect-1" src="/assets/header/parent/tts-icon.png" alt="" />

          <button
            className="w-full px-8 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-xl border-2 border-[#67CCFF]"
            onClick={handleCreateTTS}>
            목소리 TTS 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TTSCreateCompleteModal;
