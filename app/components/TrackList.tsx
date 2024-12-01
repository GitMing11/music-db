// TrackList.tsx
import React, { useState, useEffect } from "react";
import LikeButton from "./like";

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
  isLiked: boolean;
}

interface TrackListProps {
  tracks: Track[];
  onAddTrack: (track: Track) => void; // 부모 컴포넌트에서 받은 트랙 추가 함수
}

export default function TrackList({ tracks, onAddTrack }: TrackListProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserId(userData.id);
      }
    } catch (error) {
      console.error("서버 통신 오류:", error);
    }
  };

  // 로그인 상태 확인 및 userId 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="bg-[#1c1c1c] p-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={track.imageUrl}
              alt={`${track.name} album cover`}
              className="w-28 h-28 object-cover rounded-md mb-2 mx-auto"
            />
            <h3 className="text-lg font-semibold text-center">{track.name}</h3>
            <p className="text-xs text-gray-400 text-center">
              {track.artist} - {track.album}
            </p>
          </a>
          <div className="mt-2 flex flex-col items-center">
            <LikeButton
              itemId={track.id}
              initialLiked={track.isLiked}
              isLoggedIn={isLoggedIn}
              userId={userId}
            />
            {/* 트랙을 플레이리스트에 추가하는 버튼 */}
            <button
              onClick={() => onAddTrack(track)} // 트랙 객체 전체를 부모로 전달
              className="mt-2 bg-[#1DB954] text-white px-4 py-2 rounded-lg hover:bg-[#1DB954] transition-colors"
            >
              Add to Playlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
