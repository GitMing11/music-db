// components/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // search 페이지로 쿼리 파라미터와 함께 이동
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // 입력 필드 초기화
    }
  };

  return (
    <header className="bg-[#111111] text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-row space-x-6 justify-center items-center">
          <Link href="/" className="hover:text-[#901010] transition-colors">
            Home
          </Link>

          <Link href="/like" className="hover:text-[#901010] transition-colors">
            Like
          </Link>

          <Link
            href="/playlist"
            className="hover:text-[#901010] transition-colors"
          >
            Playlist
          </Link>
          {/* Artist 링크 추가*/}
          <Link
            href="/artist"
            className="hover:text-[#901010] transition-colors"
          >
            Artist
          </Link>

          {/* 검색창 */}
          <form onSubmit={handleSearchSubmit} className="flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a track"
              className="px-4 py-2 rounded-md text-black"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-[#901010] text-white rounded-md hover:bg-[#c00] transition-colors"
            >
              Search
            </button>
          </form>

          <Link
            href="/users"
            className="hover:text-[#901010] transition-colors"
          >
            MyPage
          </Link>
        </div>
      </nav>
    </header>
  );
}
