"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const searchParams = useSearchParams(); // 쿼리 파라미터를 가져옵니다.
  const selectedGenres = searchParams.getAll("genres");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedGenres.length > 0) {
        try {
          // 장르를 기반으로 추천 API 호출
          const res = await fetch(
            `/api/recommendations?genres=${selectedGenres.join(",")}`
          );
          const data = await res.json();
          setRecommendations(data.tracks);
        } catch (error) {
          console.error("추천을 가져오는 중 오류 발생:", error);
        }
      }
    };

    fetchRecommendations();
  }, [searchParams]);

  return (
    <main className="bg-[#1e1e1e] text-white min-h-screen flex flex-col items-center">
      <section className="text-center py-6 px-8 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full shadow-md rounded-b-xl">
        <h1 className="text-4xl font-bold tracking-wide">추천 곡</h1>
        {selectedGenres.length > 0 && (
          <p className="mt-4 text-lg text-gray-300">
            선택한 장르: {selectedGenres.join(", ")}
          </p>
        )}
      </section>

      <div className="flex flex-col items-center w-full max-w-3xl my-8 px-4 space-y-8">
        {recommendations.length > 0 ? (
          recommendations.map((track) => (
            <div
              key={track.id}
              className="bg-[#282828] shadow-lg rounded-lg p-6 w-full flex items-center space-x-6"
            >
              {/* 트랙 이미지 */}
              {track.album?.images?.[0]?.url && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}

              {/* 트랙 정보 및 Spotify 링크 */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{track.name}</h3>
                <p className="text-sm text-gray-400">
                  Artist: {track.artists[0]?.name}
                </p>
                <p className="text-sm text-gray-400">
                  Album: {track.album?.name}
                </p>

                {/* 아티스트의 장르 표시 */}
                {track.artists[0]?.genres &&
                  track.artists[0].genres.length > 0 && (
                    <p className="text-sm text-gray-400">
                      Artist Genre(s): {track.artists[0].genres.join(", ")}
                    </p>
                  )}
              </div>

              {/* Spotify에서 곡 듣기 링크 */}
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Spotify에서 듣기
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-400">추천된 곡이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
