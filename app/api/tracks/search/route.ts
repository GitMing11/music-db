import { NextRequest, NextResponse } from "next/server";
import { postClientCredentialsToken } from "../../spotify";
import { BASE_API_URL } from "../../url";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: NextRequest) {
  try {
    // Authorization 헤더에서 사용자 인증 토큰을 가져옴
    const userToken = req.headers.get("Authorization")?.split(" ")[1];
    if (!userToken) {
      console.error("Authorization token is missing");
      return NextResponse.json(
        { error: "Authorization 토큰이 없습니다." },
        { status: 400 }
      );
    }
    console.log("Received userToken:", userToken);

    // 사용자 인증 토큰을 검증하여 userId 추출
    const decoded: any = jwt.verify(userToken, JWT_SECRET);
    console.log("decoded: ", decoded);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

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
    const tokenResponse = await postClientCredentialsToken();
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
    const fetchedTracks = await Promise.all(
      data.tracks.items.map(async (track: any) => {
        // 사용자가 해당 트랙을 좋아요했는지 확인
        const isLiked = await prisma.like.findFirst({
          where: {
            userId: Number(userId), // JWT로부터 받은 userId
            trackId: track.id, // Spotify 트랙 ID
          },
        });

        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          imageUrl: track.album.images[0].url,
          spotifyUrl: track.external_urls.spotify,
          isLiked: isLiked ? true : false, // 좋아요 여부
        };
      })
    );

    return NextResponse.json(fetchedTracks);
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: "Spotify API 요청 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
