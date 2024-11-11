import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fairyTaleApi } from "../../api/fairytaleApi";
import { FairyTaleSearchResponse, FairyTaleListResponse, FairyTaleListItem } from "../../types/fairytaleTypes";
import BookCoverGrid from "../../components/fairytales/BookCoverGrid";
import SearchBar from "../../components/common/SearchBar";
import Lottie from "react-lottie-player";
import "../../css/FairytaleContentPage.css";
import loadingAnimation from "../../lottie/footPrint-loadingAnimation.json";

const FairytaleSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<FairyTaleSearchResponse | null>(null);
  const [allFairyTales, setAllFairyTales] = useState<FairyTaleListResponse | null>(null);
  const [query, setQuery] = useState<string>("");

  const myBookReadOrNot = allFairyTales?.content?.map((fairyTale: FairyTaleListItem) => fairyTale.isCompleted) || [];

  useEffect(() => {
    const getAllFairyTales = async () => {
      try {
        const response = await fairyTaleApi.getFairyTalesList(1, 33);
        if (response.status === 200) {
          setAllFairyTales(response.data);
          console.log(response.data);
        } else {
          console.error("유효하지 않은 응답 상태 :", response.status);
        }
      } catch (error) {
        console.error("fairytaleApi의 getFairyTalesList :", error);
      }
    };

    getAllFairyTales();
  }, []);

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

  const handleInputChange = (newQuery: string) => {
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleBookClick = (index: number) => {
    const selectedFairytaleId =
      searchResults?.content[index]?.fairytaleId || allFairyTales?.content[index]?.fairytaleId;
    if (selectedFairytaleId) {
      navigate(`/fairytale/content/${selectedFairytaleId}`, {
        state: {
          title: allFairyTales?.content[index].title,
          isCompleted: allFairyTales?.content[index].isCompleted,
          currentPage: allFairyTales?.content[index].currentPage,
          totalPages: allFairyTales?.content[index].totalPages,
        },
      });
    }
  };

  return (
    <div>
      <div className="relative w-full h-screen overflow-y-auto bg-gradient-to-b from-white">
        <div className="pt-[96px] px-10 flex justify-between items-center mb-6">
          <div className="text-2xl font-bold flex items-center font-['MapleBold']">
            {query ? "🔎 검색 결과 ..." : "📚 전체 동화 목록"}
          </div>
          <SearchBar onInputChange={handleInputChange} />
        </div>

        <div className="px-10 mb-6">
          {query && searchResults && searchResults.content.length > 0 ? (
            <BookCoverGrid
              bookCovers={searchResults.content.map((item) => item.image)}
              titles={searchResults.content.map((item) => item.title)}
              onBookClick={handleBookClick}
              myBookReadOrNot={myBookReadOrNot}
              progress={allFairyTales?.content.map((book) => book.progressRate || 0)}
            />
          ) : query ? (
            <p className="p-4 text-gray-500">검색 결과가 없습니다.</p>
          ) : allFairyTales && allFairyTales.content.length > 0 ? (
            <BookCoverGrid
              bookCovers={allFairyTales.content.map((item) => item.image)}
              titles={allFairyTales.content.map((item) => item.title)}
              onBookClick={handleBookClick}
              myBookReadOrNot={myBookReadOrNot}
              progress={allFairyTales?.content.map((book) => book.progressRate || 0)}
            />
          ) : (
            <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FairytaleSearchPage;
