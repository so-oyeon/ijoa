interface Props {
  onClose: () => void;
}

const ConfirmationModal = ({ onClose }: Props) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 13.5l8-6V18H4V7.5l8 6zm0-1.5L4 6h16l-8 6z" />
          </svg>
        </div>
      </div>
      <p className="font-semibold">고객님의 메일로</p>
      <p className="font-semibold mb-6">비밀번호가 발송되었습니다.</p>

      <button onClick={onClose} className="w-3/5 py-3 font-bold bg-yellow-400 rounded-full active:bg-yellow-500">
        로그인
      </button>
    </>
  );
};

export default ConfirmationModal;
