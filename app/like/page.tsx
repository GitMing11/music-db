"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    // API 호출하여 좋아요가 true인 트랙들 가져오기
    const fetchLikedTracks = async () => {
      try {
        const response = await fetch("/api/tracks/liked");
        if (!response.ok) {
          throw new Error("트랙을 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("트랙을 불러오는 데 오류가 발생했습니다:", error);
      }
    };

    fetchLikedTracks();
  }, []);

  return (
    <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-semibold text-[#F5A623] mb-4">
        내가 좋아요 한 트랙들
      </h1>
      {/* 총 트랙 수 표시 */}
      <p className="text-lg text-gray-400 mb-8">총 {tracks.length} 개의 트랙</p>
      <div className="flex flex-col items-center gap-10 w-full max-w-4xl">
        {tracks.length === 0 ? (
          <p className="text-lg text-gray-400">좋아요한 트랙이 없습니다.</p>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#2C2C2C] p-6 rounded-xl shadow-lg w-full flex items-center transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full"
              >
                <img
                  src={track.imageUrl}
                  alt={`${track.name} album cover`}
                  className="w-16 h-16 object-cover rounded-full border-2 border-[#F5A623] mr-6 shadow-md"
                />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-[#F5A623]">
                    {track.name}
                  </h3>
                  <p className="text-sm text-gray-300">{track.artistName}</p>
                  <p className="text-xs text-gray-500">{track.albumName}</p>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
