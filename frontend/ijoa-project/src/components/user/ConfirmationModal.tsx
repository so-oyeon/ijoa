import React from "react";

const ConfirmationModal: React.FC = () => {
  // 임시 빈 함수 (나중에 로그인 함수로 대체)
  const handleLogin = () => {
    console.log("로그인 함수가 호출될 예정입니다."); // 디버그용 메시지
  };

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
      
      <button onClick={handleLogin} className="w-3/5 py-3 font-bold bg-yellow-400 rounded-full hover:bg-yellow-500">
        로그인
      </button>
    </>
  );
};

export default ConfirmationModal;
