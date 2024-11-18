// app/api/genres/route.ts

import { NextResponse } from "next/server";
import { postClientCredentialsToken } from "../spotify";

const SPOTIFY_API_URL =
  "https://api.spotify.com/v1/recommendations/available-genre-seeds";

export async function GET() {
  try {
    const tokenResponse = await postClientCredentialsToken();

    if (
      !tokenResponse ||
      !tokenResponse.data ||
      !tokenResponse.data.access_token
    ) {
      throw new Error("Spotify 액세스 토큰 요청 실패");
    }

    const token = tokenResponse.data.access_token;

    const response = await fetch(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Spotify API 오류:", errorData);
      return NextResponse.json(
        { error: `Spotify API 오류: ${errorData.error.message}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ genres: data.genres || [] });
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: "Spotify API 요청 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
