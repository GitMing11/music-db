import React from "react";
import LikeButton from "./like";

export interface Track {
  id: number; // 트랙의 고유 ID
  name: string; // 트랙 이름
  artist: string; // 아티스트 이름
  album: string; // 앨범 이름
  imageUrl: string; // 앨범 이미지 URL
  spotifyUrl: string; // Spotify 링크
  initialLiked: boolean; // 초기 좋아요 상태
}

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  const handleLikeChange = (trackId: number, liked: boolean) => {
    console.log(`Track ${trackId} is now ${liked ? "liked" : "unliked"}`);
    // 필요하면 상태 관리 로직 추가
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
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
            <h3 className="text-lg font-semibold text-center">{track.name}</h3>
            <p className="text-xs text-gray-400 text-center">
              {track.artist} - {track.album}
            </p>
          </a>
          <div className="mt-2 flex justify-center">
            <LikeButton
              itemId={track.id}
              initialLiked={track.initialLiked} // 좋아요 초기 상태 전달
              onLikeChange={(liked) => handleLikeChange(track.id, liked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
