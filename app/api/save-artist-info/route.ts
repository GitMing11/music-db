import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received Data:', data); // 받은 데이터 로그 확인

    if (
      !data ||
      typeof data !== 'object' ||
      !data.artistId ||
      !data.name ||
      !data.imageUrl
    ) {
      return NextResponse.json(
        { message: 'Invalid request payload or missing data' },
        { status: 400 }
      );
    }

    const { artistId, name, imageUrl } = data;

    // 아티스트 정보 데이터베이스에 저장
    const savedArtist = await prisma.artist.create({
      data: {
        artist_id: artistId,
        name: name,
        image_url: imageUrl,
      },
    });

    console.log('Saved Artist Info:', savedArtist);

    return NextResponse.json({ message: 'Artist info saved successfully!' });
  } catch (error) {
    const typedError = error as Error;
    console.error('Error saving artist info:', typedError.message);
    return NextResponse.json(
      { message: 'Error saving artist info.', error: typedError.message },
      { status: 500 }
    );
  }
}
