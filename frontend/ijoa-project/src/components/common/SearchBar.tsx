import { IoSearchSharp } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="w-1/2 h-5/6 px-5 py-3 bg-white border-2 rounded-[100px] flex items-center space-x-3">
      <IoSearchSharp className="text-2xl" />
      <input
        className="w-full text-xl font-semibold outline-none"
        type="text"
        placeholder="제목 또는 키워드로 검색해 보세요"
      />
    </div>
  );
};

export default SearchBar;
