// app/api/genres/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedGenres } = body;

    if (!selectedGenres || !Array.isArray(selectedGenres)) {
      return NextResponse.json(
        { error: "잘못된 요청입니다. 'selectedGenres' 필드가 필요합니다." },
        { status: 400 }
      );
    }

    // 현재 인증된 사용자 가져오기 (예: JWT 토큰 사용)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // JWT 디코딩 및 유효성 검사
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      console.error("JWT 검증 오류:", error);
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 디코딩된 값에서 userId 가져오기
    const userId = decoded?.sub ? String(decoded.sub) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

    // 중복된 장르가 있는지 확인하고, 없으면 추가
    for (const genre of selectedGenres) {
      const existingGenre = await prisma.genre.findUnique({
        where: { name: genre },
      });

      if (!existingGenre) {
        // Genre가 존재하지 않으면 새로 생성
        await prisma.genre.create({
          data: { name: genre },
        });
      }
    }

    // 사용자의 장르와 연결
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        genres: {
          connect: selectedGenres.map((genre: string) => ({
            name: genre, // 장르 이름으로 연결
          })),
        },
      },
    });

    return NextResponse.json({ message: "장르가 저장되었습니다." });
  } catch (error) {
    console.error("장르 저장 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
