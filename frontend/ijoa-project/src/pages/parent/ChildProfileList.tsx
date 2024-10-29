import { useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import ChildProfileCreateModal from "../../components/parent/ChildProfileCreateModal";

const ChildProfileList = () => {
  const [isCreateModal, setIsCreateModal] = useState(false);
  const childList = [
    {
      img: "sampleProfileImg",
      name: "다솔이",
      age: 5,
    },
    {
      img: "sampleProfileImg",
      name: "다울이",
      age: 7,
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-[#EAF8FF] relative">
      <div className="px-40 py-10 grid gap-10">
        {/* 상단 타이틀 */}
        <div className="flex justify-center items-center space-x-3">
          <img className="w-10 aspect-1" src="/assets/header/parent/child-icon.png" alt="" />
          <p className="text-[30px] font-semibold">등록된 자녀 목록이에요</p>
        </div>

        <div className="grid grid-cols-3 gap-y-12">
          {/* 자녀 목록 */}
          {childList.map((child, index) => (
            <div className="flex flex-col items-center space-y-3" key={index}>
              <div className="w-52 aspect-1 relative">
                <img
                  className="w-full aspect-1 bg-white rounded-full border object-cover"
                  src={`/assets/header/child/${child.img}.png`}
                  alt=""
                />
                <div className="w-12 aspect-1 bg-white rounded-full bg-opacity-50 shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)] flex justify-center items-center absolute top-0 right-0">
                  <TbPencilMinus className="text-2xl" />
                </div>
              </div>

              <p className="text-2xl font-bold">
                {child.name} / {child.age}세
              </p>
            </div>
          ))}

          {/* 자녀 추가 버튼 */}
          {childList.length < 9 ? (
            <button className="flex justify-center items-center" onClick={() => setIsCreateModal(true)}>
              <IoIosAdd className="text-[150px] text-white bg-[#D9D9D9] rounded-full" />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isCreateModal ? <ChildProfileCreateModal setIsCreateModal={setIsCreateModal} /> : <></>}
    </div>
  );
};

export default ChildProfileList;
