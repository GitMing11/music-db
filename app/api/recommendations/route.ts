import { NextResponse } from "next/server";
import { postClientCredentialsToken } from "@/app/api/spotify";
import { BASE_API_URL } from "@/app/api/url";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genres = searchParams.getAll("genres");

  if (!genres || genres.length === 0) {
    return new Response(JSON.stringify({ error: "장르를 지정해 주세요." }), {
      status: 400,
    });
  }

  try {
    const recommendedTracks = await getRecommendedTracks(genres);
    return new Response(JSON.stringify({ tracks: recommendedTracks }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "추천곡을 가져오는 중 오류가 발생했습니다." }),
      { status: 500 }
    );
  }
}

// 장르를 기반으로 추천곡을 가져오는 함수
async function getRecommendedTracks(genres: string[]) {
  const token = await getSpotifyAccessToken();

  const tracks = [];
  for (const genre of genres) {
    // 각 장르에 대한 트랙을 Spotify API로 가져오기
    const res = await fetch(
      `${BASE_API_URL}/v1/recommendations?limit=5&seed_genres=${genre}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.tracks) {
      tracks.push(...data.tracks); // 여러 장르에서 나온 트랙을 합침
    }
  }

  return tracks;
}

// Spotify API에 액세스 토큰을 요청하는 함수
async function getSpotifyAccessToken() {
  const response = await postClientCredentialsToken();
  return response.data.access_token;
}
