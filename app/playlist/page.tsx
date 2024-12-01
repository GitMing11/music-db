// 클라이언트 코드 - PlaylistPage 컴포넌트
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TrackList, { Track } from "@/app/components/TrackList";

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 페이지가 로드될 때 로컬 스토리지에서 storedPlaylistId 가져오기
    let storedPlaylistId = localStorage.getItem("storedPlaylistId");

    if (!storedPlaylistId) {
      // 만약 로컬 스토리지에 저장된 playlistId가 없다면, 설정하는 코드 추가
      const newPlaylistId = "설정할_플레이리스트_ID"; // 실제 플레이리스트 ID를 여기에 넣으세요.
      localStorage.setItem("storedPlaylistId", newPlaylistId);
      storedPlaylistId = newPlaylistId;
      console.log("storedPlaylistId를 설정했습니다:", newPlaylistId);
    }

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!storedPlaylistId || !email || !token) {
      console.error("storedPlaylistId 상태:", storedPlaylistId);
      console.error("email 상태:", email);
      console.error("token 상태:", token);
      setError("로그인이 필요합니다.");
      router.push("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/playlist?playlistId=${storedPlaylistId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("플레이리스트를 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        setTracks(data.tracks);
      } catch (err: any) {
        setError(err.message);
        console.error("플레이리스트를 불러오는 중 오류:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleAddTrack = (track: Track) => {
    console.log(`${track.name}을(를) 플레이리스트에 추가합니다.`);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-white">플레이리스트</h1>
      {tracks.length === 0 ? (
        <p className="text-white">플레이리스트에 트랙이 없습니다.</p>
      ) : (
        <TrackList tracks={tracks} onAddTrack={handleAddTrack} />
      )}
    </div>
  );
}
