// app/api/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { trackId, userId, liked, trackInfo } = await req.json();

    if (!trackId || !userId || liked === undefined) {
      return NextResponse.json(
        { error: "트랙 ID, 사용자 ID, 좋아요 상태가 필요합니다." },
        { status: 400 }
      );
    }

    // 트랙 정보가 있을 경우 업데이트 (좋아요 상태가 true일 때만)
    if (liked && trackInfo && Object.keys(trackInfo).length > 0) {
      const { name, artistName, albumName, imageUrl, spotifyUrl, releaseDate } =
        trackInfo;

      await prisma.track.upsert({
        where: { id: trackId },
        update: {
          isLiked: liked,
        },
        create: {
          id: trackId,
          name,
          artistName,
          albumName,
          imageUrl,
          spotifyUrl,
          releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
          isLiked: liked,
        },
      });
    }

    // 좋아요 상태가 true일 때만 Like 테이블에 추가
    if (liked) {
      await prisma.like.upsert({
        where: {
          userId_trackId: {
            userId,
            trackId,
          },
        },
        update: {
          likedAt: new Date(),
        },
        create: {
          userId,
          trackId,
        },
      });
    } else {
      // 좋아요가 취소되면 Like 레코드 삭제
      await prisma.like.deleteMany({
        where: {
          trackId,
          userId,
        },
      });

      // 트랙의 isLiked 상태를 false로 업데이트
      await prisma.track.update({
        where: { id: trackId },
        data: { isLiked: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("좋아요 처리 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}