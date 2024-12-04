// app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";

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
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log("decoded: ", decoded);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

    // 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        genres: true,
        likes: {
          include: {
            track: true, // 좋아요한 트랙 정보 포함
          },
        },
        playlists: {
          include: {
            track: true, // 플리추가한 트랙 정보 포함
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // error 타입을 확인하고 처리하기
    if (error instanceof Error) {
      console.error("사용자 정보 가져오기 실패:", error.message); // error.message 사용
    } else {
      console.error("사용자 정보 가져오기 실패: 알 수 없는 오류", error);
    }

    return NextResponse.json(
      { error: "사용자 정보 가져오기 실패" },
      { status: 500 }
    );
  }
}
