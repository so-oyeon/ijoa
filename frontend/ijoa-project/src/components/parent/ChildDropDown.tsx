import { useState, useEffect } from "react";
import { ChildInfo } from "../../types/parentTypes";
import { useLocation } from "react-router-dom";

interface Props {
  childList: ChildInfo[];
  setSelectChild: (child: ChildInfo) => void;
}

const ChildDropDown = ({ childList, setSelectChild }: Props) => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열기/닫기 상태
  const location = useLocation();
  const childId2 = location.state?.childId2;

  // childId2가 존재하면 해당 자녀를 선택
  useEffect(() => {
    if (childId2) {
      const selectedChild = childList.find(child => child.childId === childId2);
      if (selectedChild) {
        setSelectChild(selectedChild); // 자녀 선택 상태로 설정
      }
    }
  }, [childId2, childList, setSelectChild]);

  const handleSelectChild = (child: ChildInfo) => {
    setSelectChild(child);
    setIsOpen(false); // 항목을 선택하면 드롭다운을 닫음
  };

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
        onClick={() => setIsOpen(!isOpen)} // 클릭 시 드롭다운 열기/닫기
      >
        자녀 선택
      </div>
      {isOpen && (
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {childList?.map((child, index) => (
            <li key={index} onClick={() => handleSelectChild(child)}>
              <a>
                {child.name} / 만 {child.age}세
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildDropDown;
