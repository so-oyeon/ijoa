import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/fairytale/search");
  };

  return (
    <div className="w-1/4 h-5/6 px-5 py-3 bg-white border-2 rounded-[100px] flex items-center space-x-3">
      <IoSearchSharp className="text-2xl cursor-pointer" onClick={handleSearchClick} />
      <input
        className="w-full text-xl font-semibold outline-none"
        type="text"
        placeholder="동화책 검색"
        onClick={handleSearchClick}
      />
    </div>
  );
};

export default SearchBar;
