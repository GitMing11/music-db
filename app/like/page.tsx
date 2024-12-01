"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Track {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl: string;
  spotifyUrl: string;
  isLiked: boolean;
}

export default function LikePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // API 호출하여 좋아요가 true인 트랙들 가져오기
  const fetchLikedTracks = async (token: string) => {
    try {
      const response = await fetch("/api/tracks/liked", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("트랙을 불러오는 데 실패했습니다.");
      }
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
    fetchLikedTracks(token);
  }, [router]);

  if (loading) {
    return (
      <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#901010] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-300">로딩 중입니다...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        내가 좋아요 한 트랙들
      </h1>
      <p className="text-lg text-gray-500 mb-8">
        총 <span className="font-bold">{tracks.length}</span> 개의 트랙
      </p>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {tracks.length === 0 ? (
          <p className="text-lg text-gray-300">좋아요한 트랙이 없습니다.</p>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#1e1e1e] p-5 rounded-lg shadow-lg w-full flex items-center transition-transform duration-300 transform hover:scale-105"
            >
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full"
              >
                {/* 앨범 이미지 */}
                <img
                  src={track.imageUrl}
                  alt={`${track.name} album cover`}
                  className="w-16 h-16 object-cover rounded-full border-2 border-[#b01a1a] shadow-md mr-5"
                />
                {/* 트랙 정보 */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {track.name}
                  </h3>
                  <p className="text-sm text-gray-400">{track.artistName}</p>
                  <p className="text-sm text-gray-500">{track.albumName}</p>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
