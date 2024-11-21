# project info

music db는 뮤직 프로젝트 추천 서비스입니다.

# Prisma 설치

mysql해도 되고

postgresql해도 되고

prisma를 이용해서 어떻게 스크립트를 만드는지

gpt prisma+mysql로 nextjs안에 serverless로 만들고 싶은데 함수 만들어줘

app router 형식으로

nextjs 버전은 15버전 기준으로

---

# dev에서 브랜치 만들어서 작업

remote 내용 다 받고 오류 없는 거 확인 후 푸시

겹치는 내용 작업 시 올릴 때 오류 날 수 있음!! 주의 필요

---

# npx prisma migrate dev

마이그레이션 생성

# npx prisma migrate status

마이그레이션 상태 확인

# npx prisma generate

스키마 파일이 변경될 때마다 업데이트

npx prisma studio

http://localhost:5555에 studio 켜짐

---

# .env 예시

DATABASE_URL="mysql://user:password@localhost:3306/mydatabase"
JWT_SECRET="your-secret-key"

NEXT_PUBLIC_CLIENT_ID=
NEXT_PUBLIC_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

---

# 패키지

next, react, react-dom

axios

prisma

bcryptjs

jsonwebtoken

react-toastify

[] redux + redux toolkit으로 상태관리
[] 유저가 좋아요를 누르면 해당 아이템의 id 값을 저장하는 상태값으로 저장
[] 페이지에 들어갈 때 기본적으로 isLiked api에서 music id 만 집계
[] 트랙 또는 음악을 불러올 때 {redux상태값에 저장된 id 값들 + isLiked api에서 추출한 music id 값} 부분을 뮤직 리스트의 id와 비교해서 일치하면 색칠, 안하면 색칠 x
