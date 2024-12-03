// app/api/genres/local/route.ts

import { NextResponse } from "next/server";
import genreData from "@/app/data/genre-seeds.json";

export async function GET() {
  try {
    // JSON 데이터 반환
    return NextResponse.json({ genres: genreData.genres });
  } catch (error) {
    console.error("로컬 JSON 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json(
      { error: "로컬 JSON 데이터를 가져오는 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
