"use client";

import { useEffect, useState } from "react";
import { searchArtistsByGenre } from "@/app/api/spotify-artist"; // 아티스트 검색 API 호출 함수
import Link from "next/link";
import ArtistModal from "../components/ArtistModal"; // 상대 경로로 수정

// 장르 배열에 두 개의 장르 추가
const genres = [
  "pop",
  "rock",
  "hip hop",
  "jazz",
  "classical",
  "electronic",
  "reggae", // 추가된 장르
  "blues", // 추가된 장르
];

const RandomArtistsPage = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null); // 선택된 아티스트 상태
  const [selectedGenre, setSelectedGenre] = useState(genres[0]); // 선택된 장르 상태

  useEffect(() => {
    const fetchRandomArtists = async (genre: string) => {
      setLoading(true);
      setError(null);

      try {
        const allFetchedArtists = await searchArtistsByGenre(genre, 50);

        const randomArtists = allFetchedArtists
          .sort(() => 0.5 - Math.random())
          .slice(0, 16);

        setArtists(randomArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setError(
          "Failed to load artists. Please check your API keys and network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRandomArtists(selectedGenre); // 선택된 장르로 아티스트 가져오기
  }, [selectedGenre]); // selectedGenre가 변경될 때마다 호출

  const openModal = (artist: any) => {
    setSelectedArtist(artist);
  };

  const closeModal = () => {
    setSelectedArtist(null);
  };

  // 로딩 및 에러 상태 처리
  if (loading)
    return (
      <main className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#901010] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-300">로딩 중입니다...</p>
        </div>
      </main>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (artists.length === 0)
    return <div className="text-center text-white">No artists found.</div>;

  return (
    <div className="bg-[#121212] min-h-screen text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Today's Artists</h1>
      {/* 장르 선택 버튼 추가 */}
      <div className="flex space-x-4 mb-6">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`flex items-center justify-center w-32 h-14 rounded-full text-lg font-semibold transition duration-200 ease-in-out ${
              selectedGenre === genre
                ? "bg-[#901010] text-white"
                : "bg-[#1c1c1c] text-gray-300 hover:bg-[#2c2c2c]"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-[#1c1c1c] rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => openModal(artist)} // 카드 클릭 시 모달 열기
          >
            {artist.images && artist.images.length > 0 && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 transform hover:scale-110"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
            <Link
              href={`https://open.spotify.com/artist/${artist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#901010] text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-[#b21212] text-center"
            >
              Visit on Spotify
            </Link>
          </div>
        ))}
      </div>
      {selectedArtist && (
        <ArtistModal artist={selectedArtist} onClose={closeModal} />
      )}{" "}
      {/* 모달 표시 */}
    </div>
  );
};

export default RandomArtistsPage;
