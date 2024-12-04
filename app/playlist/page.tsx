"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Track 인터페이스 정의
interface Track {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl: string;
  spotifyUrl: string;
  isLiked: boolean;
}

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 서버에서 add가 true인 트랙을 가져오는 함수
  const fetchAddTracks = async (token: string) => {
    try {
      const response = await fetch("/api/tracks/added", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // 서버 응답이 실패하면 오류 메시지 출력
        const errorData = await response.json();
        console.error("API 오류 응답:", errorData);
        throw new Error("트랙을 불러오는 데 실패했습니다.");
      }
  
      const data = await response.json();
      setTracks(data); // 받은 데이터를 트랙 상태에 저장
    } catch (error) {
      console.error("트랙을 가져오는 중 오류:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };
  

  // 로그인 상태 체크 및 API 호출
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      return;
    }

    fetchAddTracks(token); // 서버에서 트랙 데이터를 가져옴
  }, [router]);

  // 로딩 중일 때 표시
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
        플레이리스트에 추가된 트랙들
      </h1>
      <p className="text-lg text-gray-500 mb-8">
        총 <span className="font-bold">{tracks.length}</span> 개의 트랙
      </p>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {tracks.length === 0 ? (
          <p className="text-lg text-gray-300">추가된 트랙이 없습니다.</p>
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
