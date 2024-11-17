import closebutton from "/assets/close-button.png";

interface Props {
  setIsOpenSeesoSetting: (state: boolean) => void;
  setIsSeesoSeetingModal: (state: boolean) => void;
}

const EyeTrackingChoiceModal = ({ setIsOpenSeesoSetting, setIsSeesoSeetingModal }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xl mx-4 md:w-1/2 lg:w-1/3 text-center bg-white rounded-2xl shadow-lg relative">
        <div className="px-4 py-12">
          <button className="absolute top-4 right-4 text-2xl font-bold" onClick={() => setIsSeesoSeetingModal(false)}>
            <img src={closebutton} alt="닫기 버튼" />
          </button>

          <div className="flex justify-center space-x-2">
            <span className="text-xl font-bold blue-highlight">집중도 분석을 위해</span>
            <span>아이트래킹을 설정해주세요!</span>
          </div>

          <div className="mt-8 mb-8 text-lg text-center text-gray-500">학습된 TTS가 없어요.</div>
          <div className="mt-8 flex gap-4 justify-center items-center">
            <button
              className="w-36 py-2 text-[#67CCFF] text-lg font-bold bg-white rounded-3xl border-2 border-[#67CCFF] active:bg-[#e0f7ff] disabled:bg-gray-300 disabled:border-gray-300 disabled:text-white"
              onClick={() => setIsOpenSeesoSetting(true)}>
              설정하기
            </button>
            <button
              className="w-36 py-2 text-white text-lg font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF] active:bg-[#005f99] disabled:bg-gray-300 disabled:border-gray-300"
              onClick={() => setIsSeesoSeetingModal(false)}>
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeTrackingChoiceModal;
