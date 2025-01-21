# project info

music db는 뮤직 프로젝트 추천 서비스입니다.

# Prisma 설치

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
