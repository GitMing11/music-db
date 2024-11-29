"use client";

import { useEffect, useState } from "react";
import TrackList, { Track } from "@/app/components/TrackList";
import axios from "axios";

type Playlist = {
  id: number;
  name: string;
  tracks: Track[];
};

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  // 플레이리스트 불러오기
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("/api/playlist");
      if (response.data.length > 0) {
        setPlaylist(response.data[0]); // 첫 번째 플레이리스트를 설정
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  // 컴포넌트가 마운트되었을 때 플레이리스트 불러오기
  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center py-10 px-6">
      <h2 className="text-3xl font-semibold text-center text-white mb-6">
        {playlist ? playlist.name : "Loading Playlist..."}
      </h2>
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-medium text-white mb-4">Tracks</h3>
        {playlist && playlist.tracks.length > 0 ? (
          <TrackList tracks={playlist.tracks} />
        ) : (
          <p className="text-center text-gray-500">No tracks available.</p>
        )}
      </div>
    </main>
  );
}
