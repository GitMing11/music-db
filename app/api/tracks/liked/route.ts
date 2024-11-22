import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
  try {
    // Authorization 헤더에서 Bearer 토큰 추출
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 검증
    console.log("22token: ", token);
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log("decoded: ", decoded);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }
    // 좋아요가 true인 트랙들 가져오기
    const likedTracks = await prisma.track.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        likes: true,
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
