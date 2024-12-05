// app/api/genres/route.ts

import { NextResponse } from "next/server";
import { postClientCredentialsToken } from "../spotify";

const SPOTIFY_API_URL =
  "https://api.spotify.com/v1/recommendations/available-genre-seeds";

  export async function GET() {
    try {
      const tokenResponse = await postClientCredentialsToken();
  
      if (!tokenResponse?.data?.access_token) {
        throw new Error("Spotify 액세스 토큰 요청 실패");
      }
  
      const token = tokenResponse.data.access_token;
  
      const response = await fetch(SPOTIFY_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Spotify API 요청 실패");
      }
  
      const data = await response.json();
      return NextResponse.json({ genres: data.genres || [] });
    } catch (error) {
      console.error("Spotify API 요청 오류:", error);
  
      // Spotify API 실패 시 로컬 JSON 데이터 사용
      const genreData = await import("@/app/data/genre-seeds.json");
      return NextResponse.json({ genres: genreData.genres });
    }
  }
  