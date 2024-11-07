import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swiper from "../../components/fairytales/Swiper"; // 스와이퍼 컴포넌트 import
import ChoiceTab from "../../components/fairytales/ChoiceTab"; // 선택탭 컴포넌트 import
import { fairyTaleApi } from "../../api/fairytaleApi";
import { parentApi } from "../../api/parentApi";
import {
  FairyTaleRankByAgeItem,
  FairyTaleRecommendationItem,
  FairyTaleByCategoryListResponse,
} from "../../types/fairytaleTypes";
import { ChildInfo } from "../../types/parentTypes";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../lottie/footPrint-loadingAnimation.json";

const FairytaleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [popularFairyTales, setPopularFairyTales] = useState<FairyTaleRankByAgeItem[]>([]);
  const [recommendedFairyTales, setRecommendedFairyTales] = useState<FairyTaleRecommendationItem[]>([]);
  const [categoryFairyTales, setCategoryFairyTales] = useState<FairyTaleByCategoryListResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("COMMUNICATION");
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);

  const popularCovers = popularFairyTales.map((fairyTale) => fairyTale.image);
  const popularTitles = popularFairyTales.map((fairyTale) => fairyTale.title);
  const popularIsCompleted = popularFairyTales.map((fairyTale) => fairyTale.isCompleted);
  const popularCurrentPage = popularFairyTales.map((fairyTale) => fairyTale.currentPage);

  const recommendedCovers = recommendedFairyTales.map((fairyTale) => fairyTale.image);
  const recommendedTitles = recommendedFairyTales.map((fairyTale) => fairyTale.title);
  const recommendedIsCompleted = recommendedFairyTales.map((fairyTale) => fairyTale.isCompleted);
  const recommendedCurrentPage = recommendedFairyTales.map((fairyTale) => fairyTale.currentPage);

  // 카테고리 이름과 ID 매핑
  const tabItems = [
    { id: "COMMUNICATION", name: "의사소통" },
    { id: "NATURE_EXPLORATION", name: "자연탐구" },
    { id: "SOCIAL_RELATIONSHIPS", name: "사회관계" },
    { id: "ART_EXPERIENCE", name: "예술경험" },
    { id: "PHYSICAL_ACTIVITY_HEALTH", name: "신체운동 / 건강" },
  ];

  // 인기 동화책 api 통신 함수
  const getPopularFairyTalesByAge = async () => {
    if (!childInfo) return;

    try {
      const response = await fairyTaleApi.getFairyTalesRankByAge(childInfo?.age);
      if (response.status === 200) {
        const data = response.data;

        if (Array.isArray(data)) {
          setPopularFairyTales(data);
        } else {
          console.error("유효하지 않은 데이터 구조 :", data);
        }
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairyTalesRankByAge :", error);
    }
  };

  // 사용자 맞춤 책 추천 api 통신 함수
  const getRecommendedFairyTales = async () => {
    try {
      const response = await fairyTaleApi.getFairyTaleRecommendations();
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          setRecommendedFairyTales(data);
        } else {
          console.error("유효하지 않은 데이터 구조 :", data);
        }
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairyTalesRecommendations :", error);
    }
  };

  // 카테고리별 동화책 조회 함수
  const getFairyTalesByCategory = async (category: string, page: number = 1, size: number = 5) => {
    try {
      const response = await fairyTaleApi.getFairyTalesListByCategory(category, page, size);
      if (response.status === 200) {
        const data: FairyTaleByCategoryListResponse = response.data;
        setCategoryFairyTales(data); // 전체 데이터를 상태로 설정
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairyTalesListByCategory :", error);
    }
  };

  // 자녀 프로필을 가져오는 api 통신 함수
  const getChildProfile = async () => {
    const childId = parseInt(localStorage.getItem("childId") || "0", 10);
    if (!childId) return;

    try {
      const response = await parentApi.getChildProfile(childId);
      if (response.status === 200 && response.data) {
        setChildInfo(response.data);
      }
    } catch (error) {
      console.error("parentApi의 getChildProfile:", error);
    }
  };

  const handlePopularBookClick = (index: number) => {
    navigate(`/fairytale/content/${popularFairyTales[index].fairytaleId}`, {
      state: {
        title: popularTitles[index],
        isCompleted: popularIsCompleted[index],
        currentPage: popularCurrentPage[index],
      },
    });
  };

  const handleRecommendedBookClick = (index: number) => {
    navigate(`/fairytale/content/${recommendedFairyTales[index].fairytaleId}`, {
      state: {
        title: recommendedTitles[index],
        isCompleted: recommendedIsCompleted[index],
        currentPage: recommendedCurrentPage[index],
      },
    });
  };

  const handleCategoryBookClick = (index: number) => {
    if (categoryFairyTales && categoryFairyTales.content && categoryFairyTales.content[index]) {
      const selectedFairyTale = categoryFairyTales.content[index];
      navigate(`/fairytale/content/${selectedFairyTale.fairytaleId}`, {
        state: {
          title: selectedFairyTale.title,
          isCompleted: selectedFairyTale.isCompleted,
          currentPage: selectedFairyTale.currentPage,
        },
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    getChildProfile();
    getRecommendedFairyTales(); // 사용자 맞춤 추천 데이터 가져오기
    getFairyTalesByCategory(selectedCategory); // 선택된 카테고리 동화책 데이터 가져오기
  }, [selectedCategory]); // categoryId가 변경될 때마다 호출

  useEffect(() => {
    if (!childInfo) return;
    getPopularFairyTalesByAge();
  }, [childInfo]);

  return (
    <div>
      <div className="pt-24 pb-24 px-10 text-xl">
        <div className="h-[300px] mb-10">
          <div className="mb-5 text-2xl font-bold">🏆 {childInfo?.age}살 인기 동화책</div>
          {popularFairyTales.length > 0 ? (
            <Swiper
              bookCovers={popularCovers}
              titles={popularTitles}
              isCompleted={popularFairyTales.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handlePopularBookClick}
            />
          ) : (
            <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>
        <div className="h-[300px] mb-10">
          <div className="mb-5 text-2xl font-bold">🧸 이런 책 어때요?</div>
          {recommendedFairyTales.length > 0 ? (
            <Swiper
              bookCovers={recommendedCovers}
              titles={recommendedTitles}
              isCompleted={recommendedFairyTales.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handleRecommendedBookClick}
            />
          ) : (
            <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>
        <div className="h-[300px]">
          <div className="flex justify-between mb-5">
            <div className="text-2xl font-bold">🌟 카테고리 별 인기 동화책</div>
            <ChoiceTab tabs={tabItems} onTabClick={handleCategoryChange} />
          </div>
          {categoryFairyTales && categoryFairyTales.content && categoryFairyTales.content.length > 0 ? (
            <Swiper
              bookCovers={categoryFairyTales.content.map((fairyTale) => fairyTale.image)}
              titles={categoryFairyTales.content.map((fairyTale) => fairyTale.title)}
              isCompleted={categoryFairyTales.content.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handleCategoryBookClick}
            />
          ) : (
            <Lottie className="h-full w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FairytaleListPage;
