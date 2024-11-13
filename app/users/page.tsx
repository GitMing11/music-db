// app/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/User";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // 로그인 여부 확인 및 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      router.push("/login");
    } else {
      // 로그인된 경우 사용자 정보 가져오기
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // 로그인 페이지로 리디렉션
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
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        로그아웃
      </button>
    </div>
  );
}
