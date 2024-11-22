// app/search/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TrackList, { Track } from "@/app/components/TrackList";
import { postClientCredentialsToken } from "@/app/api/spotify";
import axios from "axios";
import { BASE_API_URL } from "@/app/api/url";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 최근 검색어 저장 함수
  const saveRecentSearch = (newQuery: string) => {
    // 이미 recentSearches에 동일한 검색어가 있으면 제거
    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        newQuery,
        ...prevSearches.filter((search) => search !== newQuery),
      ];
      // 최근 검색어를 localStorage에 저장
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

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
        isLiked: track.isLiked || false,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  // 컴포넌트가 마운트되었을 때 recentSearches를 localStorage에서 불러오기
  useEffect(() => {
    const storedRecentSearches = localStorage.getItem("recentSearches");
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  // query가 변경될 때마다 검색하고, recentSearches에 추가
  useEffect(() => {
    if (query) {
      searchTracks(query);
      saveRecentSearch(query);
    }
  }, [query]);

  return (
    <main className="bg-[#202020] text-white min-h-screen flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl font-semibold text-center text-white mb-4">
        Search Results for "{query}"
      </h2>

      {/* 최근 검색어 표시 */}
      <div className="w-full max-w-4xl mb-4">
        <h3 className="text-xl text-white mb-2">Recent Searches</h3>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                // 클릭한 검색어로 URL을 업데이트
                router.push(`?query=${search}`);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* 트랙 리스트 */}
      <div className="w-full max-w-4xl">
        <TrackList tracks={tracks} />
      </div>
    </main>
  );
}
