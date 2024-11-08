# Prisma 설치

# mysql해도 되고

# postgresql해도 되고

# prisma를 이용해서 어떻게 스크립트를 만드는지

# gpt prisma+mysql로 nextjs안에 serverless로 만들고 싶은데 함수 만들어줘

# app router 형식으로

# nextjs 버전은 15버전 기준으로

---

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

react, react-dom
axios
prisma
bcryptjs
jsonwebtoken
react-toastify
