import { IoSearchSharp } from "react-icons/io5";

interface SearchBarProps {
  onInputChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onInputChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onInputChange(newQuery);
  };

  return (
    <div className="w-1/3 h-5/6 px-5 py-3 bg-white border-2 rounded-[100px] flex items-center space-x-3 font-['MapleLight']">
      <IoSearchSharp className="text-2xl cursor-pointer" />
      <input
        className="w-full text-xl font-semibold outline-none"
        type="text"
        placeholder="제목 또는 키워드로 검색해 보세요."
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
