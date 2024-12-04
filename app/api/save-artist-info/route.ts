import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 요청 본문에서 데이터 추출
    const body = await req.json();
    console.log('Received body:', body);

    // 요청 데이터에서 필요한 값 추출
    const { artistId, name, imageUrl, userId } = body;

    // 필수 데이터 유효성 검사
    if (!artistId || !name || !imageUrl || !userId) {
      return new NextResponse(
        JSON.stringify({ error: '필수 데이터가 부족합니다.' }),
        { status: 400 }
      );
    }

    // Prisma를 사용하여 데이터 저장
    const savedArtist = await prisma.artist.create({
      data: {
        artistId, // 아티스트 ID
        name, // 이름
        imageUrl, // 이미지 URL
        popularity: 0, // 기본값
        userId: parseInt(userId, 10), // userId를 정수로 변환
      },
    });

    // 저장된 데이터 로그 출력
    console.log('Saved artist in DB:', savedArtist);

    // 성공 응답
    return new NextResponse(JSON.stringify({ message: '정보 저장 완료' }), {
      status: 200,
    });
  } catch (error) {
    // 에러 로그
    console.error('Error processing request:', error);

    // 실패 응답
    return new NextResponse(
      JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}
