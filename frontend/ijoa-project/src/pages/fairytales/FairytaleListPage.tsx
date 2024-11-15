import React, { useEffect, useState } from "react";
import "../../css/FairytaleContentPage.css";
import { useNavigate } from "react-router-dom";
import Swiper from "../../components/fairytales/main/Swiper"; // 스와이퍼 컴포넌트 import
import ChoiceTab from "../../components/fairytales/main/ChoiceTab"; // 선택탭 컴포넌트 import
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
import { useDispatch } from "react-redux";
import { openTutorial, setStep } from "../../redux/tutorialSlice";
import Tutorial from "../../components/tutorial/Tutorial";
import { userApi } from "../../api/userApi";

const FairytaleListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [popularFairyTales, setPopularFairyTales] = useState<FairyTaleRankByAgeItem[]>([]);
  const [recommendedFairyTales, setRecommendedFairyTales] = useState<FairyTaleRecommendationItem[]>([]);
  const [categoryFairyTales, setCategoryFairyTales] = useState<FairyTaleByCategoryListResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("COMMUNICATION");
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);

  const popularCovers = popularFairyTales.map((fairyTale) => fairyTale.image);
  const popularTitles = popularFairyTales.map((fairyTale) => fairyTale.title);
  const popularIsCompleted = popularFairyTales.map((fairyTale) => fairyTale.isCompleted);
  const popularCurrentPage = popularFairyTales.map((fairyTale) => fairyTale.currentPage);
  const popularTotalPage = popularFairyTales.map((fairyTale) => fairyTale.totalPages);

  const recommendedCovers = recommendedFairyTales.map((fairyTale) => fairyTale.image);
  const recommendedTitles = recommendedFairyTales.map((fairyTale) => fairyTale.title);
  const recommendedIsCompleted = recommendedFairyTales.map((fairyTale) => fairyTale.isCompleted);
  const recommendedCurrentPage = recommendedFairyTales.map((fairyTale) => fairyTale.currentPage);
  const recommendedTotalPage = recommendedFairyTales.map((fairyTale) => fairyTale.totalPages);

  // 카테고리 이름과 ID 매핑
  const tabItems = [
    { id: "COMMUNICATION", name: "의사소통", shortName: "소통" },
    { id: "NATURE_EXPLORATION", name: "자연탐구", shortName: "자연" },
    { id: "SOCIAL_RELATIONSHIPS", name: "사회관계", shortName: "사회" },
    { id: "ART_EXPERIENCE", name: "예술경험", shortName: "예술" },
    { id: "PHYSICAL_ACTIVITY_HEALTH", name: "신체운동 / 건강", shortName: "신체" },
  ];

  // 인기 동화책 api 통신 함수
  const getPopularFairyTalesByAge = async () => {
    try {
      const response = await fairyTaleApi.getFairyTalesRankByAge();
      if (response.status === 200) {
        const data = response.data;
        if (data && Array.isArray(data)) {
          setPopularFairyTales(data);
        } else {
          console.error("유효하지 않은 데이터 구조 :", data);
        }
      } else if (response.status === 204) {
        setPopularFairyTales([]); // 데이터가 없을 경우 빈 배열로 설정
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

        if (data && Array.isArray(data.content)) {
          setRecommendedFairyTales(data.content);
        } else {
          console.error("유효하지 않은 데이터 구조 :", data);
        }
      }
    } catch (error) {
      console.error("fairytaleApi의 getFairyTalesRecommendations :", error);
    }
  };

  // 카테고리별 동화책 조회 함수
  const getFairyTalesByCategory = async (category: string, page: number = 1, size: number = 10) => {
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
        totalPages: popularTotalPage[index],
        from: "list",
      },
    });
  };

  const handleRecommendedBookClick = (index: number) => {
    navigate(`/fairytale/content/${recommendedFairyTales[index].fairytaleId}`, {
      state: {
        title: recommendedTitles[index],
        isCompleted: recommendedIsCompleted[index],
        currentPage: recommendedCurrentPage[index],
        totalPages: recommendedTotalPage[index],
        from: "list",
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
          totalPages: selectedFairyTale.totalPages,
          from: "list",
        },
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const getTutorialStatus = async () => {
      try {
        const response = await userApi.getTutorialInfo();
        if (response.status === 200) {
          // 튜토리얼이 완료되지 않았다면 8단계부터 이어서 시작
          if (!response.data.completeTutorial) {
            dispatch(openTutorial());
            dispatch(setStep(8)); // 8단계로 설정
          }
        }
      } catch (error) {
        console.log("getTutorialInfo API 오류: ", error);
      }
    };

    getTutorialStatus();
  }, [dispatch]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getPopularFairyTalesByAge();
        await getChildProfile();
        await getRecommendedFairyTales();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    getFairyTalesByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <div className="pt-6 pb-24 px-10 text-xl">
        <div className="h-[310px] mb-10 overflow-hidden">
          <div className="mb-5 text-2xl font-bold font-['MapleBold']">🏆 {childInfo?.age}살 인기 동화책</div>

          {popularFairyTales.length > 0 ? (
            <Swiper
              bookCovers={popularCovers}
              titles={popularTitles}
              isCompleted={popularFairyTales.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handlePopularBookClick}
              progress={popularFairyTales?.map((book) => book.progressRate || 0)}
            />
          ) : popularFairyTales.length === 0 ? (
            <div className="mt-24 text-lg font-bold">
              아직 {childInfo?.age}살 인기 동화책 데이터가 부족해요 😅
            </div>
          ) : (
            <Lottie className="w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>

        {recommendedFairyTales.length > 0 && (
          <div className="h-[310px] mb-10 overflow-hidden">
            <div className="mb-5 text-2xl font-bold font-['MapleBold']">🧸 이런 책 어때요?</div>
            <Swiper
              bookCovers={recommendedCovers}
              titles={recommendedTitles}
              isCompleted={recommendedFairyTales.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handleRecommendedBookClick}
              progress={recommendedFairyTales?.map((book) => book.progressRate || 0)}
            />
          </div>
        )}

        <div className="h-[310px] overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between mb-5">
            <div className="text-2xl font-bold font-['MapleBold']">🌟 카테고리 별 동화책</div>
            <ChoiceTab tabs={tabItems} onTabClick={handleCategoryChange} />
          </div>
          {categoryFairyTales && categoryFairyTales.content && categoryFairyTales.content.length > 0 ? (
            <Swiper
              bookCovers={categoryFairyTales.content.map((fairyTale) => fairyTale.image)}
              titles={categoryFairyTales.content.map((fairyTale) => fairyTale.title)}
              isCompleted={categoryFairyTales.content.map((fairyTale) => fairyTale.isCompleted)}
              onBookClick={handleCategoryBookClick}
              progress={categoryFairyTales.content.map((fairyTale) => fairyTale.progressRate || 0)}
            />
          ) : (
            <Lottie className="h-full w-40 aspect-1" loop play animationData={loadingAnimation} />
          )}
        </div>
      </div>
      <Tutorial />
    </div>
  );
};

export default FairytaleListPage;
