"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/User";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [savedGenres, setSavedGenres] = useState<string[]>([]); // 저장된 장르 상태 추가
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

  // 로그인된 경우 사용자 데이터를 가져오는 함수
  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("사용자 정보 가져오기 실패");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data: User = await res.json();
        setCurrentUser(data);

        // 사용자 데이터를 로드한 후 장르 목록을 가져옴
        fetchGenres();
      } catch (error) {
        console.error("사용자 정보 가져오는 중 오류 발생:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    },
    [fetchGenres, router]
  );

  // 컴포넌트가 처음 렌더링될 때 사용자 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUser(token);
  }, [fetchUser, router]);

  // 로그아웃 동작 처리
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
    // 선택한 장르를 저장된 장르로 업데이트
    setSavedGenres(selectedGenres);
  };

  if (!currentUser) return <div>로딩 중...</div>;

  return (
    <main className="bg-[#1e1e1e] text-white min-h-screen flex flex-col items-center">
      {/* 헤더 */}
      <section className="text-center py-6 px-8 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full shadow-md rounded-b-xl">
        <h1 className="text-4xl font-bold tracking-wide">마이 페이지</h1>
      </section>

      {/* 회원 정보 및 장르 선택 섹션 */}
      <div className="flex flex-col items-center w-full max-w-3xl mt-8 px-4 space-y-8">
        {/* 회원 정보 */}
        <div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            회원 정보
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              이름:{" "}
              <span className="font-semibold text-white">
                {currentUser.name}
              </span>
            </p>
            <p className="text-lg text-gray-300">
              이메일:{" "}
              <span className="font-semibold text-white">
                {currentUser.email}
              </span>
            </p>
            <p className="text-lg text-gray-300">
              가입일:{" "}
              <span className="font-semibold text-white">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          {savedGenres.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">
                선택한 장르
              </h3>
              <p className="text-sm text-gray-400">{savedGenres.join(", ")}</p>
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 장르 선택 UI */}
        <div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            장르 선택
          </h2>
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
          <div className="mt-6">
            <button
              onClick={handleSaveGenres}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              선택한 장르 저장
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
