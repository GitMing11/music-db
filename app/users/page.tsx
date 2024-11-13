"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/User";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [genres, setGenres] = useState<string[]>([]); // 장르 목록 상태
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // 선택된 장르 목록
  const router = useRouter();

  // 로그인 여부 확인 및 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const fetchUser = async () => {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 포함
          },
        });

        if (res.ok) {
          const data: User = await res.json();
          setCurrentUser(data);
        } else {
          console.error("사용자 정보 가져오기 실패");
          router.push("/login"); // 오류 발생 시 로그인 페이지로 리디렉션
        }
      };

      fetchUser();
    }
  }, [router]);

  // 장르 목록을 가져오는 함수
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("/api/genres"); // 토큰 없이 호출
  
        if (res.ok) {
          const data = await res.json();
          setGenres(data.genres); // 장르 목록 업데이트
        } else {
          const errorData = await res.json();
          console.error("장르 목록 가져오기 실패:", errorData.error);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };
  
    fetchGenres();
  }, []);
  

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // 로그인 페이지로 리디렉션
  };

  // 장르 선택 처리
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter((g) => g !== genre); // 이미 선택된 장르는 제외
      } else {
        return [...prevGenres, genre]; // 새로운 장르는 추가
      }
    });
  };

  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-6">마이 페이지</h1>
      <div className="mb-4">
        <p className="text-lg font-medium">이름: {currentUser.name}</p>
        <p className="text-lg font-medium">이메일: {currentUser.email}</p>
        <p className="text-lg font-medium">
          가입일: {new Date(currentUser.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* 장르 선택 UI */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">당신의 취향에 맞는 장르를 선택하세요:</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-4 py-2 border rounded-lg ${
                selectedGenres.includes(genre)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              } hover:bg-blue-200`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        로그아웃
      </button>
    </div>
  );
}
