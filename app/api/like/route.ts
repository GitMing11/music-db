// app/api/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { trackId, userId, liked, trackInfo } = await req.json();

    console.log("trackId:", trackId, "Type:", typeof trackId);
    console.log("userId:", userId, "Type:", typeof userId);
    console.log("liked:", liked, "Type:", typeof liked);
    console.log("trackInfo:", trackInfo, "Type:", typeof trackInfo);

    // 필수 값 체크
    if (!trackId || !userId || liked === undefined) {
      console.error("필수 값 누락:", { trackId, userId, liked });
      return NextResponse.json(
        { error: "트랙 ID, 사용자 ID, 좋아요 상태가 필요합니다." },
        { status: 400 }
      );
    }

    // 트랙 정보 확인 및 저장 (좋아요를 눌렀을 경우에만)
    if (liked && trackInfo && Object.keys(trackInfo).length > 0) {
      const { name, artistName, albumName, imageUrl, spotifyUrl, releaseDate } =
        trackInfo;

      console.log("트랙 정보 저장 (upsert) 시도:", trackId);
      const track = await prisma.track.upsert({
        where: { id: trackId },
        update: {}, // 존재할 경우 업데이트하지 않음
        create: {
          id: trackId,
          name,
          artistName,
          albumName,
          imageUrl,
          spotifyUrl,
          releaseDate: releaseDate ? new Date(releaseDate) : new Date(), // 날짜 변환
        },
      });

      console.log("트랙 저장 완료:", track);
    } else {
      console.log(
        "좋아요 상태가 false이거나 트랙 정보가 제공되지 않아 트랙 정보 저장 생략"
      );
    }

    // 좋아요 상태 업데이트
    if (liked) {
      console.log("좋아요 상태가 true, 좋아요 추가 시도:");
      const like = await prisma.like.create({
        data: {
          trackId,
          userId,
        },
      });

      console.log("좋아요 저장 완료:", like);
    } else {
      console.log("좋아요 상태가 false, 좋아요 삭제 시도:");
      const result = await prisma.like.deleteMany({
        where: {
          trackId,
          userId,
        },
      });

      console.log("좋아요 삭제 완료:", result.count);
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
