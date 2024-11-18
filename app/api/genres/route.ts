import { NextResponse } from "next/server";
import { postClientCredentialsToken } from "../spotify";

const SPOTIFY_API_URL =
  "https://api.spotify.com/v1/recommendations/available-genre-seeds";

export async function GET() {
  try {
    // Spotify 액세스 토큰 요청
    const tokenResponse = await postClientCredentialsToken();
    const token = tokenResponse.data.access_token;

    // Spotify API로 장르 목록 요청
    const response = await fetch(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Failed to fetch genres: ${errorData.error.message}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ genres: data.genres }); // JSON 형식으로 장르 목록 반환
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
