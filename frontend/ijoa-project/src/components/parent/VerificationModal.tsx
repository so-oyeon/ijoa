import React, { useState } from "react";
import back from "/assets/back.png";
import { userApi } from "../../api/userApi";
import Swal from "sweetalert2";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onNext }) => {
  const [password, setPassword] = useState("");

  const handleNext = async () => {
    try {
      const response = await userApi.verifyPassword(password);
      if (response.status === 200) {
        onNext();
      }
    } catch (error) {
      console.log("userApi의 veryfiPassword : ", error);
      Swal.fire({
        icon: "error",
        title: "비밀번호가 잘못되었습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-1/3 py-16 bg-white rounded-2xl p-6">
        <button className="absolute w-[50px] top-4 right-4 text-red-500" onClick={onClose}>
          <img src={back} alt="뒤로가기" />
        </button>
        <p className="text-center text-gray-700 text-2xl font-bold mt-6 mb-4">본인 확인</p>
        <p className="text-center text-gray-600 font-semibold">회원 정보 접근 시, 개인정보보호를 위해</p>
        <p className="text-center text-gray-600 font-semibold mb-6">본인확인을 진행합니다.</p>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className="w-3/4 h-[50px] mb-6 px-4 py-2 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-1/3 h-[60px] py-2 bg-[#67CCFF] text-white rounded-full font-bold active:bg-[#005f99]"
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;
