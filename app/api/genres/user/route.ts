// app/api/genres/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // 인증 토큰 확인
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // JWT 디코딩
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded?.sub ? String(decoded.sub) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

    // Prisma로 저장된 장르 가져오기
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { genres: true }, // 유저와 연결된 장르 포함
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 사용자와 연결된 장르 반환
    const savedGenres = user.genres?.map((genre) => genre.name) || [];
    return NextResponse.json({ savedGenres });
  } catch (error) {
    console.error("저장된 장르 가져오기 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
