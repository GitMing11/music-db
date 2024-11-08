import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  const { name, password, email } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password,
        email,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
