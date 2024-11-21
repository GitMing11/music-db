// app/api/tracks/[trackId]/route.ts

import { NextResponse } from "next/server";
import { postClientCredentialsToken } from "../../spotify";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/tracks/";

export async function GET(
  req: Request,
  { params }: { params: { trackId: string } }
) {
  const { trackId } = await params; // 비동기적으로 params를 처리

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

    const response = await fetch(`${SPOTIFY_API_URL}${trackId}`, {
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
    if (!data || !data.id) {
      throw new Error("트랙 정보를 불러오는 데 실패했습니다.");
    }

    const trackData = {
      id: data.id,
      name: data.name,
      imageUrl: data.album.images[0]?.url || "",
      spotifyUrl: data.external_urls.spotify,
      artistName: data.artists[0]?.name || "",
      albumName: data.album.name,
      releaseDate: data.album.release_date,
      isLiked: data.isLiked,
    };

    return NextResponse.json(trackData);
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: error || "Spotify API 요청 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
