// app/components/TrackList.tsx
import React, { useState, useEffect } from "react";
import LikeButton from "./like";

export interface Track {
  id: string; // 트랙의 고유 ID
  name: string; // 트랙 이름
  artist: string; // 아티스트 이름
  album: string; // 앨범 이름
  imageUrl: string; // 앨범 이미지 URL
  spotifyUrl: string; // Spotify 링크
  initialLiked: boolean; // 초기 좋아요 상태
}

interface TrackListProps {
  tracks: Track[]; // 트랙 배열
}

export default function TrackList({ tracks }: TrackListProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // 로그인 상태 확인 및 userId 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      // 서버에서 유저 정보 가져오기
      const fetchUserInfo = async () => {
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUserId(userData.id); // 유저 ID 설정
          } else {
            console.error("사용자 정보 가져오기 실패");
          }
        } catch (error) {
          console.error("서버 통신 오류:", error);
        }
      };

      fetchUserInfo();
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  const handleLikeChange = (trackId: string, liked: boolean) => {
    console.log(`Track ${trackId} is now ${liked ? "liked" : "unliked"}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => {
        return (
          <div
            key={track.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
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
              <h3 className="text-lg font-semibold text-center">
                {track.name}
              </h3>
              <p className="text-xs text-gray-400 text-center">
                {track.artist} - {track.album}
              </p>
            </a>
            <div className="mt-2 flex justify-center">
              <LikeButton
                itemId={track.id}
                initialLiked={track.initialLiked}
                onLikeChange={(liked) => handleLikeChange(track.id, liked)}
                isLoggedIn={isLoggedIn}
                userId={userId}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
