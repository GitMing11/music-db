// app/api/spotify.ts
import axios from "axios";
import { BASE_URL } from "@/app/api/url";

interface TokenObject {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ClientCredentialsTokenResponse extends TokenObject {}

interface AuthorizationCodeTokenResponse extends TokenObject {
  refresh_token: string;
  scope: string;
}

interface RefreshTokenResponse extends TokenObject {
  scope: string;
}

// Spotify 클라이언트 자격증명 토큰 요청
export const postClientCredentialsToken = () => {
  return axios<ClientCredentialsTokenResponse>({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString("base64"),
    },
    data: {
      grant_type: "client_credentials",
    },
  });
};

// Spotify Authorization Code로 토큰 요청
export const postAuthorizationCodeToken = (code: string) => {
  return axios<AuthorizationCodeTokenResponse>({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString("base64"),
    },
    data: {
      code: code,
      redirect_uri: BASE_URL + "/api/callback",
      grant_type: "authorization_code",
    },
  });
};

// Spotify refresh token 요청
export const postRefreshToken = (refresh_token: string) => {
  return axios<RefreshTokenResponse>({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString("base64"),
    },
    data: {
      grant_type: "refresh_token",
      refresh_token,
    },
  });
};
