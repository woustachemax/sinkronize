import jwt from "jsonwebtoken";
import client from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set");
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ msg: "Missing or malformed auth header" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json({ msg: "Missing friendId" }, { status: 400 });
    }

    if (decoded.id === friendId) {
      return NextResponse.json({ msg: "Cannot add yourself" }, { status: 400 });
    }

    const user = await client.user.update({
      where: { id: decoded.id },
      data: {
        friends: {
          connect: { id: friendId },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Friend added successfully!" });
  } catch (e) {
    console.error("POST /friends error", e);
    return NextResponse.json({ msg: "Failed to add friend" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ msg: "Missing or malformed auth header" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    const user = await client.user.findUnique({
      where: { id: decoded.id },
      include: {
        friends: {
          select: {
            id: true,
            username: true,
            skills: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ friends: user.friends || [] });
  } catch (e) {
    console.error("GET /friends error", e);
    return NextResponse.json({ msg: "Failed to fetch friends" }, { status: 500 });
  }
}
