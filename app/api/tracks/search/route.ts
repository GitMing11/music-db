import { NextRequest, NextResponse } from "next/server";
import { postClientCredentialsToken } from "../../spotify";
import { BASE_API_URL } from "../../url";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: NextRequest) {
  try {
    const Token = req.headers.get("Authorization")?.split(" ")[1];

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    const tokenResponse = await postClientCredentialsToken();
    const spotifyToken = tokenResponse.data.access_token;

    const url = new URL(`${BASE_API_URL}/v1/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("type", "track");

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

    const createTrackInfo = (track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      imageUrl: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify,
    });

    let userId: number | null = null;
    if (Token) {
      try {
        const decoded: any = jwt.verify(Token, JWT_SECRET);
        userId = decoded?.sub ? Number(decoded.sub) : null;

        if (!userId) {
          return NextResponse.json(
            { error: "유효하지 않은 사용자 ID입니다." },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("JWT 검증 실패:", error);
        return NextResponse.json(
          { error: "유효하지 않은 인증 토큰입니다." },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      const tracks = data.tracks.items.map(createTrackInfo);
      return NextResponse.json(tracks);
    }

    const fetchedTracks = await Promise.all(
      data.tracks.items.map(async (track: any) => {
        const baseTrackInfo = createTrackInfo(track);

        const isLiked = await prisma.like.findFirst({
          where: {
            userId,
            trackId: track.id,
          },
        });

        return {
          ...baseTrackInfo,
          isLiked: !!isLiked,
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
