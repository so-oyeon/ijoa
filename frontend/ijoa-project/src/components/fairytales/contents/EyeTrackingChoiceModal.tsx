import closebutton from "/assets/close-button.png";

interface Props {
  setIsOpenSeesoSetting: (state: boolean) => void;
  setIsSeesoSeetingModal: (state: boolean) => void;
}

const EyeTrackingChoiceModal = ({ setIsOpenSeesoSetting, setIsSeesoSeetingModal }: Props) => {
  const guideText = [
    "화면의 크기와 화면과의 거리를 선택해 주세요.",
    "순서대로 나타나는 5개의 검은색 점을 응시해주세요.",
    "시선 인식이 완료되면 눈을 5번정도 깜박여주세요. (최종 조정)",
  ];
  const cautionText = [
    "여러 명이 동시에 화면을 쳐다보면 제대로 인식되지 않을 수 있습니다.",
    "검은색 점이 빨간색 점으로 완전히 바뀔 때까지 정확하게 응시해주세요.",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-['MapleLight']">
      <div className="w-full max-w-xl mx-4 md:w-1/2 lg:w-1/3 text-center bg-white rounded-2xl shadow-lg relative">
        <div className="px-4 py-12">
          <button className="absolute top-4 right-4 text-2xl font-bold" onClick={() => setIsSeesoSeetingModal(false)}>
            <img src={closebutton} alt="닫기 버튼" />
          </button>

          <div className="grid gap-8">
            <div className="font-bold flex justify-center space-x-2">
              <span className="text-xl blue-highlight">집중도 분석을 위해</span>
              <span>아이트래킹을 설정해주세요!</span>
            </div>

            {/* 설정 방법 */}
            <div className="text-[#565656] text-center font-bold grid gap-3 place-content-center">
              <p>설정 순서</p>
              <div className="flex flex-col items-start space-y-2">
                {guideText.map((text, index) => (
                  <p key={index}>
                    {index + 1}. {text}
                  </p>
                ))}
              </div>
            </div>

            {/* 주의 사항 */}
            <div className="text-sm text-[#565656] text-centerflex flex-col items-start space-y-1">
              {cautionText.map((text, index) => (
                <p key={index}>* {text}</p>
              ))}
            </div>

            <div className="flex gap-4 justify-center items-center">
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
    </div>
  );
};

export default EyeTrackingChoiceModal;
