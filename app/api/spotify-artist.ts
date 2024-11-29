// app/api/spotify-artist.ts
import axios from 'axios';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const getAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token; // 액세스 토큰 반환
};

// 장르 기반 아티스트 검색
export const searchArtistsByGenre = async (
  genre: string,
  limit: number = 50
): Promise<any[]> => {
  const accessToken = await getAccessToken(); // 액세스 토큰 가져오기

  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    params: {
      q: `genre:"${genre}"`, // 장르로 검색
      type: 'artist',
      limit: limit,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 추가
    },
  });

  return response.data.artists.items; // 아티스트 데이터 반환
};
