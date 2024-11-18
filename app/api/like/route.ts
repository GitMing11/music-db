import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { trackId, userId, liked } = await req.json();

    // 필수값 체크
    if (!trackId || !userId || liked === undefined) {
      console.error("필수 값이 누락되었습니다:", { trackId, userId, liked });
      return NextResponse.json(
        { error: "트랙 ID, 사용자 ID, 좋아요 상태(liked)가 필요합니다." },
        { status: 400 }
      );
    }

    if (liked) {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          trackId: trackId,
          userId: userId,
        },
      });
    } else {
      // 좋아요 삭제
      await prisma.like.deleteMany({
        where: {
          trackId: trackId,
          userId: userId,
        },
      });
    }

    // 특정 트랙의 좋아요 수 반환
    const likeCount = await prisma.like.count({
      where: { trackId: trackId },
    });

    return NextResponse.json({ likeCount });
  } catch (error) {
    console.error("좋아요 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
