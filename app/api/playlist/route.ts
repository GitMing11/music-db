// app/api/playlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { userId, trackId, added, trackInfo } = await req.json();

        // 필수 정보가 누락된 경우
        if (!trackId || !userId || added === undefined) {
        return NextResponse.json(
            { error: "사용자 ID, 트랙 ID, 플리추가 상태가 필요합니다." },
            { status: 400 }
        );
        }

        // 트랙 정보가 있을 경우 업데이트 (플리추가 상태가 true일 때만)
        if (added && trackInfo && Object.keys(trackInfo).length > 0) {
            const { name, artistName, albumName, imageUrl, spotifyUrl, releaseDate } =
                trackInfo;

            await prisma.track.upsert({
                where: { id: trackId },
                update: {
                    add: added,
                },
                create: {
                    id: trackId,
                    name,
                    artistName,
                    albumName,
                    imageUrl,
                    spotifyUrl,
                    releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
                    add: added,
                },
            });
        }

        // 플리추가 상태가 true일 때만 playlist 테이블에 추가
        if (added) {
            await prisma.playlist.upsert({
                where: {
                    userId_trackId: {
                        userId,
                        trackId,
                    },
                },
                update: {
                    addedAt: new Date(),
                },
                create: {
                    userId,
                    trackId,
                },
            });
        } else {
            // 플리추가가 취소되면 playlist 레코드 삭제
            await prisma.playlist.deleteMany({
            where: {
                trackId,
                userId,
            },
            });
    
            // 트랙의 add 상태를 false로 업데이트
            await prisma.track.update({
                where: { id: trackId },
                data: { add: false },
            });
        }
    
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("플레이리스트 추가 중 오류:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
