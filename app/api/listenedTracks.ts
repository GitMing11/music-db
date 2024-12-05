// 사용자로부터 곡 정보를 받고 데이터베이스에 저장하는 역할

// pages/api/listenedTracks.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, track } = req.body;

        try {
        // 사용자가 이미 이 트랙을 들었는지 확인합니다.
        const existingTrack = await prisma.track.findFirst({
            where: {
            spotifyUrl: track.spotifyUrl,
            likes: {
                some: {
                userId: userId,
                },
            },
            },
        });

        if (!existingTrack) {
            // 만약 존재하지 않으면 새로운 트랙을 추가합니다.
            await prisma.track.create({
            data: {
                name: track.name,
                imageUrl: track.imageUrl,
                spotifyUrl: track.spotifyUrl,
                artistName: track.artistName,
                albumName: track.albumName,
                releaseDate: new Date(track.releaseDate),
            },
            });
        }

        res.status(200).json({ message: 'Track saved successfully' });
        } catch (error) {
        console.error('Error saving track:', error);
        res.status(500).json({ error: 'Error saving track' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
