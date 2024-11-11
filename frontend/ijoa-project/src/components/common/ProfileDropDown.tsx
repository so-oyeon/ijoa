import { MdLogout, MdChildCare } from "react-icons/md";
import { PiUserSwitch } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { ChildInfo } from "../../types/parentTypes";
import { parentApi } from "../../api/parentApi";
import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import Swal from "sweetalert2";

const ProfileDropDown = () => {
  const navigate = useNavigate();
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);

  const handleChangeToParent = () => {
    localStorage.setItem("userType", "parent");
    localStorage.removeItem("childId");
    navigate("/parent/child/list");
  };

  const handleLogout = async () => {
    try {
      const response = await userApi.logout();
      if (response.status === 200) {
        localStorage.clear();
      }
      Swal.fire({
        icon: "success",
        title: "로그아웃이 완료되었습니다",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.log("userApi의 logout : ", error);
      Swal.fire({
        icon: "error",
        title: "로그아웃 실패",
        text: "다시 시도해 주세요.",
        confirmButtonText: "확인",
      });
    }
  };

  // 자녀 프로필을 가져오는 api 통신 함수
  const getChildProfile = async () => {
    const childId = parseInt(localStorage.getItem("childId") || "0", 10);
    if (!childId) {
      console.error("Child ID is undefined");
      return;
    }

    try {
      const response = await parentApi.getChildProfile(childId);
      if (response.status === 200 && response.data) {
        setChildInfo(response.data);
      }
    } catch (error) {
      console.error("parentApi의 getChildProfile:", error);
    }
  };

  useEffect(() => {
    getChildProfile();
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <button className="w-14 flex flex-col justify-center items-center space-y-1">
        <img
          className="w-12 aspect-1 p-2 bg-white rounded-full shadow-[0_3px_3px_1px_rgba(0,0,0,0.1)]"
          src="/assets/profile-img-girl.png"
          alt=""
        />
        <p className="text-sm text-[#B27F44] font-bold">프로필</p>
      </button>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content w-60 p-2 mt-3 bg-base-100 rounded-box border-2 shadow-lg z-[1] grid gap-1"
      >
        <li className="h-14">
          <div className="w-full h-full flex items-center space-x-3 hover:bg-white">
            <MdChildCare className="text-2xl" />
            <p className="text-lg">{childInfo ? `${childInfo.name} (만 ${childInfo.age}세)` : "Loading..."}</p>
          </div>
        </li>
        <hr className="h-[0.5px] bg-[#9e9e9e]" />
        <li className="h-14" onClick={handleChangeToParent}>
          <div className="w-full h-full flex items-center space-x-3 hover:bg-[#FFF0CA] rounded-2xl">
            <PiUserSwitch className="text-2xl" />
            <p className="text-lg">부모로 전환</p>
          </div>
        </li>
        <li className="h-14" onClick={handleLogout}>
          <div className="w-full h-full flex items-center space-x-3 hover:bg-[#FFF0CA] rounded-2xl">
            <MdLogout className="text-2xl" />
            <p className="text-lg">로그아웃</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropDown;
