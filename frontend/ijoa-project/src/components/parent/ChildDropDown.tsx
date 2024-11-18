import { ChildInfo } from "../../types/parentTypes";

interface Props {
  childList: ChildInfo[];
  setSelectChild: (child: ChildInfo) => void;
}

const ChildDropDown = ({ childList, setSelectChild }: Props) => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        자녀 선택
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {childList?.map((child, index) => (
          <li key={index} onClick={() => setSelectChild(child)}>
            <a>
              {child.name} / 만 {child.age}세
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChildDropDown;
