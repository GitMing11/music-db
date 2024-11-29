// app/components/TrackList.tsx
import React, { useState, useEffect } from "react";
import LikeButton from "./like";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

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
}

export default function TrackList({ tracks }: TrackListProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Redux에서 좋아요 상태 가져오기
  //const likedTracks = useSelector((state: RootState) => state.like);

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
          <div className="mt-2 flex justify-center">
            <LikeButton
              itemId={track.id}
              initialLiked={track.isLiked} // Redux 상태와 비교하여 초기값 설정
              isLoggedIn={isLoggedIn}
              userId={userId}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
