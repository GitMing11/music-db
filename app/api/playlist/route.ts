// app/api/playlist/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    try {
        // 헤더에서 토큰을 가져옵니다.
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");

        if (!token || !JWT_SECRET) {
            return NextResponse.json(
                { error: "토큰과 JWT_SECRET이 필요합니다." },
                { status: 400 }
            );
        }

        // JWT 토큰을 검증하고 디코딩합니다.
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (!decoded || !decoded.email) {
            return NextResponse.json(
                { error: "유효한 토큰이 아닙니다." },
                { status: 401 }
            );
        }

        // JWT 디코딩 후 email을 추출합니다.
        const email = decoded.email;

        // URL 쿼리 파라미터에서 playlistId 가져오기
        const url = new URL(req.url);
        const playlistId = url.searchParams.get("playlistId");

        if (!playlistId) {
            return NextResponse.json(
                { error: "플레이리스트 ID가 필요합니다." },
                { status: 400 }
            );
        }

        // 이메일을 이용해 사용자를 조회하고 플레이리스트를 가져옵니다.
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "사용자를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const playlist = await prisma.playlist.findUnique({
            where: { id: parseInt(playlistId, 10) },
            include: { tracks: true },
        });

        if (!playlist || playlist.userId !== user.id) {
            return NextResponse.json(
                { error: "사용자 권한이 없습니다." },
                { status: 403 }
            );
        }

        return NextResponse.json({ tracks: playlist.tracks }, { status: 200 });
    } catch (error) {
        console.error("플레이리스트를 불러오는 중 오류:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다. 다시 시도해 주세요." },
            { status: 500 }
        );
    }
}