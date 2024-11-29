// prisma/artistCheck.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkArtists() {
  const artists = await prisma.artist.findMany(); // 'artist' 모델의 모든 데이터 조회
  console.log(artists); // 콘솔에 아티스트 리스트 출력
}

checkArtists().finally(async () => {
  await prisma.$disconnect();
});
