"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/User";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // 로그인된 경우 사용자 데이터를 가져오는 함수
  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data: User = await res.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("사용자 정보 가져오는 중 오류 발생:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUser(token);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleGenre = () => {
    router.push("/genre");
  };

  if (!currentUser)
    return (
      <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#901010] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-300">로딩 중입니다...</p>
        </div>
      </main>
    );

  return (
    <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center">
      <section className="text-center py-8 px-12 bg-gradient-to-r from-[#901010] to-[#b01a1a] text-white w-full shadow-lg rounded-b-xl">
        <h1 className="text-4xl font-extrabold tracking-tight">마이 페이지</h1>
      </section>

      {/* 추천 페이지 버튼 */}
      <div className="w-full max-w-lg mt-8 px-6">
        <button
          onClick={handleGenre}
          className="w-full px-6 py-3 bg-[#901010] text-white rounded-lg shadow-md hover:bg-[#b01a1a] transition duration-300 transform hover:scale-105"
        >
          추천 페이지로 가기
        </button>
      </div>

      {/* 회원 정보 섹션 */}
      <div className="flex flex-col items-center w-full max-w-3xl mt-6 px-6 space-y-8">
        <div className="bg-[#1e1e1e] shadow-2xl rounded-2xl p-8 w-full">
          <h2 className="text-3xl font-semibold text-gray-100 mb-6">
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
            <p className="text-lg text-gray-300">
              선택한 장르:{" "}
              <span className="font-semibold text-white">
                {currentUser.genres && currentUser.genres.length > 0
                  ? currentUser.genres.map((genre) => genre.name).join(", ")
                  : "선택된 장르 없음"}
              </span>
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
