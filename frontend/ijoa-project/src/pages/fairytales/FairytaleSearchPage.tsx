import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleSearchResponse } from "../../types/fairytaleTypes";
import Swiper from "../../components/fairytales/Swiper";

const FairytaleSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<FairyTaleSearchResponse | null>(null);
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 검색 동화책 api 통신 함수
  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      try {
        const response = await fairyTaleApi.getFairyTalesBySearch(searchQuery, 0);
        if (response.status === 200) {
          const data = response.data;
          setSearchResults(data);
        } else {
          console.error("유효하지 않은 응답 상태 :", response.status);
        }
      } catch (error) {
        console.error("fairytaleApi의 getFairyTalesBySearch :", error);
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const bookCovers = searchResults?.content.map((item) => item.image) || [];
  const titles = searchResults?.content.map((item) => item.title) || [];

  const handleBookClick = (index: number) => {
    const selectedFairytaleId = searchResults?.content[index].fairytaleId;
    if (selectedFairytaleId) {
      navigate(`/fairytale/detail/${selectedFairytaleId}`);
    }
  };

  const handleGoToMain = () => {
    navigate(`/fairytale/list`);
  };

  // 컴포넌트 마운트 시 input에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full h-24 px-10 py-3 bg-gradient-to-b from-white justify-between items-center fixed top-0 z-50">
      <div className="w-2/3 h-full flex items-center space-x-5">
        {/* 로고 이미지 추가 */}
        <img className="h-full cursor-pointer" src="/assets/logo.png" alt="로고" onClick={handleGoToMain} />

        <div className="w-1/2 h-5/6 px-5 py-3 bg-white border-2 rounded-[100px] flex items-center space-x-3">
          <IoSearchSharp className="text-2xl cursor-pointer" />
          <input
            ref={inputRef} // input에 ref 추가
            className="w-full text-xl font-semibold outline-none"
            type="text"
            placeholder="제목 또는 키워드로 검색해 보세요."
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-6 mb-6">
        {query && (
          <>
            <div className="text-2xl font-bold mb-8">🔎 검색 결과 ...</div>
            {searchResults && searchResults.content.length > 0 ? (
              <Swiper
                bookCovers={bookCovers}
                titles={titles}
                onBookClick={handleBookClick}
                spaceBetween={10}
                slidesPerView={3.5}
              />
            ) : (
              <p className="p-4 text-gray-500">검색 결과가 없습니다.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FairytaleSearchPage;
