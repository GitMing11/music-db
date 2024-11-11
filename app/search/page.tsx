// app/search/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Next.js useSearchParams import
import TrackList, { Track } from "@/app/components/TrackList";
import { postClientCredentialsToken } from "@/app/api/spotify";
import axios from "axios";
import { BASE_API_URL } from "@/app/api/url";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [tracks, setTracks] = useState<Track[]>([]);

  // Spotify API를 통해 트랙 검색 함수
  const searchTracks = async (query: string) => {
    try {
      const tokenResponse = await postClientCredentialsToken();
      const token = tokenResponse.data.access_token;

      const response = await axios.get(`${BASE_API_URL}/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
        },
      });

      const fetchedTracks = response.data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        imageUrl: track.album.images[0].url,
        spotifyUrl: track.external_urls.spotify,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  // 컴포넌트가 마운트되거나 query가 변경될 때 API 호출
  useEffect(() => {
    if (query) {
      searchTracks(query);
    }
  }, [query]);

  return (
    <main className="bg-[#202020] text-white min-h-screen flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl font-semibold text-center text-white mb-4">
        Search Results for "{query}"
      </h2>
      <div className="w-full max-w-4xl">
        <TrackList tracks={tracks} />
      </div>
    </main>
  );
}
