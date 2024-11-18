import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { selectedGenres } = await req.json();

    // Authorization 헤더에서 토큰 추출
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "인증 토큰이 필요합니다." },
        { status: 401 }
      );
    }

    // 토큰 디코드
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // 장르 저장
    await prisma.user.update({
      where: { id: userId },
      data: {
        genres: {
          connectOrCreate: selectedGenres.map((genre: string) => ({
            where: { name: genre },
            create: { name: genre },
          })),
        },
      },
    });

    return NextResponse.json({ message: "장르가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("장르 저장 중 오류 발생:", error);
    return NextResponse.json(
      { error: "장르 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
