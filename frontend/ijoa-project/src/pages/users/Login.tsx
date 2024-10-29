import React, { useState } from "react";
import Bat from "/assets/user/bat.png";
import Bear from "/assets/user/bear.png";
import Cat from "/assets/user/cat.png";
import Lion from "/assets/user/lion.png";
import Monkey from "/assets/user/monkey.png";
import LoginPicture2 from "/assets/user/login2.png";
import "../../css/Login.css";
import UserModal from "../../components/user/UserModal";

{
  /* 모달 창 타입에 따라 로그인 / 회원가입 / 비밀번호 찾기 / 비밀번호변경확인이메일 로 분기 */
}
type ModalType = "login" | "signup" | "forgotPassword" | "confirmation" | "notFound" | null;

const Login: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  {
    /* 모달 창 열기 */
  }
  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  {
    /* 모달 창 닫기 */
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 메인 배경화면 */}
      <img
        src={LoginPicture2}
        alt="로그인 화면"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />
      {/* 아이조아 텍스트 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 text-[140px] font-['SDGothic'] text-white-stroke">
        <span className="text-[#FFCC00] ">아</span>
        <span className="text-[#99CC66] ">이</span>
        <span className="text-[#FF6666] ">조</span>
        <span className="text-[#339999] ">아</span>
      </div>
      {/* 동물들 위치조정 */}
      <div className="absolute inset-0 z-20">
        <img src={Bat} alt="박쥐" className="absolute -ml-5 bottom-40 w-[200px]" />
        <img src={Lion} alt="사자" className="absolute -ml-5 bottom-4 w-[180px]" />
        <img src={Cat} alt="고양이" className="absolute right-0 -mr-3 bottom-40 w-[180px]" />
        <img src={Bear} alt="곰" className="absolute right-2 -mr-9 bottom-4 w-[200px]" />
        <img src={Monkey} alt="원숭이" className="absolute top-1/3 left-[17%] transform -translate-y-1/2 w-[180px]" />
      </div>
      {/* 로그인, 회원가입 버튼 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-16 flex flex-col items-center space-y-4 z-20">
        <button
          onClick={() => openModal("login")}
          className="w-72 h-20 bg-yellow-400 text-black text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200"
        >
          로그인
        </button>
        <button
          onClick={() => openModal("signup")}
          className="w-72 h-20 bg-orange-500 text-black text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200"
        >
          회원가입
        </button>
      </div>

      {/* 모달창 */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalType={modalType}
        openForgotPasswordModal={() => openModal("forgotPassword")}
        openConfirmationModal={() => openModal("confirmation")}
        openNotFoundModal={() => openModal("notFound")}
      />
    </div>
  );
};

export default Login;
