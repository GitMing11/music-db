import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Prisma Client를 사용해 사용자 플레이리스트와 트랙들을 가져옵니다.
        const playlists: any = await prisma.playlist.findMany({
        include: {
            tracks: {
            include: {
                track: true,
            },
            },
        },
        });

        // 필요한 데이터를 추출하여 반환합니다.
        const formattedPlaylists = playlists.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map((playlistTrack: any) => ({
            id: playlistTrack.track.id,
            name: playlistTrack.track.name,
            imageUrl: playlistTrack.track.imageUrl,
            spotifyUrl: playlistTrack.track.spotifyUrl,
            artistName: playlistTrack.track.artistName,
            albumName: playlistTrack.track.albumName,
            releaseDate: playlistTrack.track.releaseDate,
        })),
        }));

        return NextResponse.json(formattedPlaylists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return NextResponse.json(
        { error: "플레이리스트를 가져오는 중 오류가 발생했습니다." },
        { status: 500 }
        );
    }
}
