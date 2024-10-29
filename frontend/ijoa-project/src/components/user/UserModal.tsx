import React, { useState } from "react";
import axios from "axios";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "login" | "signup" | "forgotPassword" | "confirmation" | "notFound" | null;
  openForgotPasswordModal: () => void;
  openConfirmationModal: () => void;
  openNotFoundModal: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  modalType,
  openForgotPasswordModal,
  openConfirmationModal,
  openNotFoundModal,
}) => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async () => {
    try {
      // 서버로 이메일 존재 여부 확인 요청(주소는 나중에 연결하기)
      const response = await axios.get(`http://k11d105.p.ssafy.io:8080/api/v1/user/check-email/${email}`);
      if (response.status === 200) {
        openConfirmationModal(); // 이메일이 존재하면 확인 모달을 열기
      }
    } catch (error) {
      openNotFoundModal(); // 이메일이 없으면 "존재하지 않는 계정입니다" 모달 열기

      console.error("서버 요청 오류:", error);
    }
  };
  if (!isOpen || !modalType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative w-1/3 py-8 text-center bg-white rounded-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        {/* 모달 타입이 로그인 일때 */}
        {modalType === "login" && (
          <>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <button className="w-3/4 py-3 mb-4 font-bold bg-yellow-400 rounded-full hover:bg-yellow-500">로그인</button>
            <div className="text-right mr-5">
              <button
                onClick={openForgotPasswordModal} // 비밀번호 찾기 모달 열기
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                비밀번호 찾기
              </button>
            </div>
          </>
        )}
        {/* 모달 타입이 회원가입 일때 */}
        {modalType === "signup" && (
          <>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-3/4 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <button className="w-3/4 py-3 mb-4 font-bold bg-orange-400 rounded-full hover:bg-orange-500">
              회원가입
            </button>
          </>
        )}
        {/* 모달 타입이 비밀번호찾기 일때 */}
        {modalType === "forgotPassword" && (
          <>
            <p className="font-bold text-xl mb-4">비밀번호 찾기</p>
            <p className="font-semibold">기존에 가입하신 이메일을 입력하시면, </p>
            <p className="font-semibold mb-4">비밀번호 변경 메일을 발송해드립니다.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className="w-3/5 mb-4 px-4 py-3 rounded-full bg-gray-100 text-gray-500 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleEmailSubmit}
              className="w-3/5 py-3 mb-4 font-bold bg-[#F7EAFF] rounded-full hover:bg-[#f0d9ff]"
            >
              비밀번호 변경 이메일 전송
            </button>
          </>
        )}
        {/* 모달 타입이 비밀번호확인변경이메일 일때 */}
        {modalType === "confirmation" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-300 flex items-center justify-center">
                {/* 이메일 아이콘 */}
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 13.5l8-6V18H4V7.5l8 6zm0-1.5L4 6h16l-8 6z" />
                </svg>
              </div>
            </div>
            <p className="font-semibold">고객님의 메일로</p>
            <p className="font-semibold mb-6">비밀번호가 발송되었습니다.</p>
            <button onClick={onClose} className="w-3/5 py-3 font-bold bg-yellow-400 rounded-full hover:bg-yellow-500">
              로그인
            </button>
          </>
        )}
        {modalType === "notFound" && (
          <>
            <p className="font-bold text-2xl mb-4 text-red-600">존재하지 않는 계정입니다.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
