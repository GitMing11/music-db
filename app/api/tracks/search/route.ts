import { NextRequest, NextResponse } from "next/server";
import { postClientCredentialsToken } from "../../spotify";
import { BASE_API_URL } from "../../url";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    // Spotify API 토큰 받기
    let tokenResponse;
    try {
      tokenResponse = await postClientCredentialsToken();
    } catch (tokenError) {
      console.error("Spotify 토큰 요청 실패:", tokenError);
      return NextResponse.json(
        { error: "Spotify 토큰 요청 중 문제가 발생했습니다." },
        { status: 500 }
      );
    }

    const spotifyToken = tokenResponse.data.access_token;

    // 쿼리 파라미터를 URL에 직접 추가
    const url = new URL(`${BASE_API_URL}/v1/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("type", "track");

    // Spotify API에서 트랙 검색
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
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
    const fetchedTracks = data.tracks.items.map((track: any) => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        imageUrl: track.album.images[0].url,
        spotifyUrl: track.external_urls.spotify,
        isLiked: false, // 기본값으로 좋아요 여부를 false로 설정
      };
    });

    return NextResponse.json(fetchedTracks);
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: "Spotify API 요청 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
