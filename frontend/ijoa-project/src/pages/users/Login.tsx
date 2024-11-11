import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Framer Motion import
import Bat from "/assets/user/bat.png";
import Bear from "/assets/user/bear.png";
import Cat from "/assets/user/cat.png";
import Lion from "/assets/user/lion.png";
import Monkey from "/assets/user/monkey.png";
import LoginPicture2 from "/assets/user/login2.png";
import "../../css/Login.css";
import UserModal from "../../components/user/UserModal";
import { useNavigate } from "react-router-dom";

type ModalType = "login" | "signup" | "forgotPassword" | "confirmation" | "notFound" | null;

interface LoginProps {
  onAssetsLoaded: () => void;
}

const Login: React.FC<LoginProps> = ({ onAssetsLoaded }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  useEffect(() => {
    const images = [LoginPicture2, Bat, Bear, Cat, Lion, Monkey];
    let loadedCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === images.length) {
          onAssetsLoaded();
        }
      };
    });
  }, [onAssetsLoaded]);

  // 페이지 로딩 시 토큰 확인 후 부모 메인으로 이동
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/parent/child/list");
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src={LoginPicture2}
        alt="로그인 화면"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />

      {/* 동물들 애니메이션 */}
      <div className="absolute inset-0 z-20">
        <motion.img
          src={Bat}
          alt="박쥐"
          className="absolute bottom-[20%] w-[15vw] md:w-[12vw] -ml-[2vw] lg:w-[15vw]"
          animate={{ y: ["0%", "-5%", "0%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={Lion}
          alt="사자"
          className="absolute bottom-[0%] w-[13vw] md:w-[10vw] -ml-[2vw] lg:w-[13vw]"
          animate={{ y: ["0%", "-3%", "0%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={Cat}
          alt="고양이"
          className="absolute bottom-[20%] w-[13vw] md:w-[11vw] lg:w-[13vw] right-0 -mr-8"
          animate={{ y: ["0%", "-5%", "0%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={Bear}
          alt="곰"
          className="absolute bottom-[0%] w-[13vw] md:w-[11vw] lg:w-[13vw] right-0 -mr-8"
          animate={{ y: ["0%", "-4%", "0%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 원숭이 애니메이션 */}
        <motion.img
          src={Monkey}
          alt="원숭이"
          className="absolute top-[25%] left-[15%] w-[13vw] md:w-[11vw] lg:w-[13vw]"
          animate={{
            y: ["0%", "10%", "0%"],
            rotate: ["0deg", "-10deg", "10deg", "0deg"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="h-full flex flex-col justify-center items-center relative z-50">
        <div className="flex space-x-2 text-[10vw] md:text-[7vw] lg:text-[10vw] font-['SDGothic'] text-white-stroke">
          <span className="text-[#FFCC00] ">아</span>
          <span className="text-[#99CC66] ">이</span>
          <span className="text-[#FF6666] ">조</span>
          <span className="text-[#339999] ">아</span>
        </div>

        <div className="w-full flex flex-col items-center space-y-3">
          <button
            onClick={() => openModal("login")}
           className="w-[30vw] md:w-[30vw] lg:w-[30vw] h-12 md:h-16 lg:h-20 bg-yellow-400 text-black text-lg md:text-xl lg:text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200 active:scale-110"
          >
            로그인
          </button>
          <button
            onClick={() => openModal("signup")}
            className="w-[30vw] md:w-[30vw] lg:w-[30vw] h-12 md:h-16 lg:h-20 bg-orange-500 text-black text-lg md:text-xl lg:text-2xl font-bold rounded-full shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-200 active:scale-110"
          >
            회원가입
          </button>
        </div>
      </div>

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
