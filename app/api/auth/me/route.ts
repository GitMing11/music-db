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
    const userId = decoded.userId;

    // 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        genres: true,
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
    console.error("사용자 정보 가져오기 실패:", error);
    return NextResponse.json(
      { error: "사용자 정보 가져오기 실패" },
      { status: 500 }
    );
  }
}
