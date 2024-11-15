"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ScrollToButton from "../components/scroll";

export default function GenrePage() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [savedGenres, setSavedGenres] = useState<string[]>([]);
  const [isGenresVisible, setIsGenresVisible] = useState(false);
  const router = useRouter();

  // API에서 장르를 가져오는 함수
  const fetchGenres = useCallback(async () => {
    try {
      const res = await fetch("/api/genres");

      if (!res.ok) {
        const errorData = await res.json();
        console.error("장르 목록 가져오기 실패:", errorData.error);
        return;
      }

      const data = await res.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("장르 목록을 가져오는 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // 장르 선택 처리
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // 선택한 장르를 저장하는 함수
  const handleSaveGenres = () => {
    setSavedGenres(selectedGenres);
  };

  // 장르 목록 보이기/숨기기 토글
  const toggleGenresVisibility = () => {
    setIsGenresVisible((prevState) => !prevState);
  };

  // 추천 페이지로 이동
  const goToRecommendationPage = () => {
    router.push("/recommendation");
  };

  return (
    <main className="bg-[#1e1e1e] text-white min-h-screen flex flex-col items-center">
      <ScrollToButton />

      {/* 헤더 */}
      <section className="text-center py-6 px-8 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full shadow-md rounded-b-xl">
        <h1 className="text-4xl font-bold tracking-wide">장르 추천</h1>
      </section>

      {/* 장르 선택 UI */}
      <div className="flex flex-col items-center w-full max-w-3xl my-8 px-4 space-y-8">
        {/* 저장된 장르 표시 */}
        {savedGenres.length > 0 && (
          <div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              선택한 장르
            </h3>
            <p className="text-sm text-gray-400">{savedGenres.join(", ")}</p>
          </div>
        )}

        {/* 장르 선택 UI */}
        <div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            장르 선택
          </h2>

          {/* 더보기/접기 버튼 */}
          <button
            onClick={toggleGenresVisibility}
            className="text-blue-500 hover:text-blue-400 mb-4"
          >
            {isGenresVisible ? "접기" : "장르 선택 더보기"}
          </button>

          {/* 장르 목록 보이기/숨기기 */}
          {isGenresVisible && (
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-4 py-2 border-2 border-solid rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedGenres.includes(genre)
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-transparent text-blue-500 border-blue-500"
                  } hover:bg-blue-500 hover:text-white`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {/* 장르 저장 버튼 */}
          <div className="mt-6">
            <button
              onClick={handleSaveGenres}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              선택한 장르 저장
            </button>
          </div>
        </div>

        {/* 음악 추천 받기 버튼 */}
        {savedGenres.length > 0 && (
          <div className="w-full max-w-md">
            <button
              onClick={goToRecommendationPage}
              className="w-full px-6 py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              음악 추천 받기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
