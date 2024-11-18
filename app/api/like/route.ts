// app/api/like/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { trackId, userId, liked } = await req.json();

    if (!trackId || !userId) {
      return NextResponse.json(
        { error: "트랙 ID와 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    if (liked) {
      // 좋아요 생성
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
