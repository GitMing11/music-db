// app/api/genres/remove/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  try {
    const { genres } = await req.json(); // POST 바디에서 삭제할 장르 배열 받기

    if (!genres || genres.length === 0) {
      return NextResponse.json(
        { error: "삭제할 장르가 지정되지 않았습니다." },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded?.sub ? String(decoded.sub) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

    // 전달된 장르들을 삭제
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        genres: {
          disconnect: genres.map((genre: string) => ({ name: genre })), // 여러 장르를 disconnect
        },
      },
    });

    return NextResponse.json({ message: "장르가 삭제되었습니다." });
  } catch (error) {
    console.error("장르 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
