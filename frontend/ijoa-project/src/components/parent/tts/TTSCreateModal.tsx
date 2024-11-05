// import { CiCamera } from "react-icons/ci";

interface Props {
  setIsCreateModal: (state: boolean) => void;
}

const TTSCreateModal = ({ setIsCreateModal }: Props) => {
  return (
    <div className="py-8 bg-black bg-opacity-60 flex justify-center items-center fixed inset-0 z-50">
      <div className="p-10 bg-white rounded-2xl shadow-lg">
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <img className="w-10 h-10" src="/assets/close-button.png" alt="" onClick={() => setIsCreateModal(false)} />
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* 안내 멘트 */}
          <div className="text-xl text-[#565656] text-center font-bold grid gap-5">
            <p className="underline underline-offset-1 decoration-8 decoration-[#67CCFF]">TTS 생성</p>
            <div className="grid gap-2">
              <p>3단계에 걸쳐 녹음이 진행됩니다.</p>
              <p>정해진 스크립트에 맞춰 녹음을 진행해 주세요.</p>
            </div>
          </div>

          <img className="w-32" src="/assets/parent/tts-mic-icon.png" alt="" />

          {/* 녹음 시작하기 버튼 */}
          <button className="w-full px-8 py-2 text-white text-xl font-bold bg-[#67CCFF] rounded-3xl border-2 border-[#67CCFF]">
            녹음 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TTSCreateModal;
