import jwt from "jsonwebtoken";
import client from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("The JWT Secret hasn't been exported for Signup / is not defined in environment variables");
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
      return NextResponse.json({ msg: "Missing friendId in body" }, { status: 400 });
    }

    if (decoded.id === friendId) {
      return NextResponse.json({ msg: "Cannot add yourself as a friend" }, { status: 400 });
    }

    await client.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });

    return NextResponse.json({ msg: "Friend added successfully!" });
  } catch (e) {
    console.error("Add friend error:", e);
    return NextResponse.json({ msg: "Failed to add friend" }, { status: 500 });
  }
}

