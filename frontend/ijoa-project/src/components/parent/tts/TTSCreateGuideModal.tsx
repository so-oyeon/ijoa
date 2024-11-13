// import { CiCamera } from "react-icons/ci";

interface Props {
  setIsCreateGuideModal: (state: boolean) => void;
  setIsCreateModal: (state: boolean) => void;
}

const TTSCreateModal = ({ setIsCreateGuideModal, setIsCreateModal }: Props) => {
  const guideText = [
    "정해진 스크립트에 맞춰 녹음을 진행해 주세요.",
    "조용한 공간에서 녹음을 진행해 주세요.",
    "자녀에게 책을 읽어주듯 어조에 신경 써주세요.",
  ];

  const handleStartRecording = () => {
    setIsCreateGuideModal(false);
    setIsCreateModal(true);
  };

  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50  font-['MapleLight']">
      <div className="w-1/2 p-10 bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img
            className="w-10 h-10"
            src="/assets/close-button.png"
            alt=""
            onClick={() => setIsCreateGuideModal(false)}
          />
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* 안내 멘트 */}
          <div className="text-xl text-[#565656] text-center font-bold grid gap-5">
            <p className="underline underline-offset-1 decoration-8 decoration-[#67CCFF]">TTS 생성</p>
            <p>10단계에 걸쳐 녹음이 진행됩니다.</p>
            <div className="flex flex-col items-start space-y-2">
              {guideText.map((text, index) => (
                <p key={index}>
                  {index + 1}. {text}
                </p>
              ))}
            </div>
          </div>

          <img className="w-32" src="/assets/parent/tts-mic-icon.png" alt="" />

          {/* 녹음 시작하기 버튼 */}
          <button
            className="w-full px-8 py-2 text-white text-xl bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99]"
            onClick={handleStartRecording}>
            녹음 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TTSCreateModal;
