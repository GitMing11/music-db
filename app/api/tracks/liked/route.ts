import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client import

export async function GET() {
  try {
    // 좋아요가 true인 트랙들 가져오기
    const likedTracks = await prisma.track.findMany({
      where: {
        isLiked: true,
      },
      include: {
        likes: true, // 좋아요한 사용자들도 함께 불러올 수 있음
      },
    });

    // 트랙 정보를 반환
    return NextResponse.json(likedTracks);
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json(
      { error: "트랙 정보를 불러오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
