import jwt from 'jsonwebtoken'
import client from "@/app/lib/db";
import { NextRequest, NextResponse } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET!;

if(!JWT_SECRET){
    throw new Error("The JWT Secret hasn't been exported for Signup / is not defined in environment variables")
}

export async function GET(req: NextRequest) {

    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ msg: "Missing or malformed auth header" }, { status: 401 });
      }
      
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {id: string, email: string}

        const otherUsers = await client.user.findMany({
            where:{
                id: {not: decoded.id},
            },
            select:{
                username: true,
                skills:{
                    select:{
                        talents: true,
                    }
                }
            }   
        })

    return NextResponse.json({ users: otherUsers });

    }


    catch(e){
        return NextResponse.json({ msg: "Invalid token" }, { status: 403 })

    }
}