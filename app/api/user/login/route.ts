// import { PrismaClient } from "@prisma/client";
import client from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { loginSchema } from "../../../lib/schema";

// const client = new PrismaClient();



const JWT_SECRET = process.env.JWT_SECRET!;

if(!JWT_SECRET){
    throw new Error("The JWT Secret hasn't been exported for Login/ is not defined in environment variables")
}

export default async function POST(req: NextRequest){
    const body: z.infer<typeof loginSchema> =  await req.json();
    const login = loginSchema.safeParse(body);

    if(!login.success){
        return NextResponse.json({msg: "Please re-check your inputs"}
            ,{status: 411})
    }

    const userExists = await client.user.findUnique({
        where:{
            email: body.email
        }
    })

    if(!userExists){
        return NextResponse.json({
            msg: "User not found, try signing-up."
        },
        {status: 411})
    }

    const revealedPd = await bcrypt.compare(body.password, userExists.password)

    if(!revealedPd){
        return NextResponse.json({
            msg: "The password you entered is incorrect"
        },
        {status: 411})
    }

    const token = jwt.sign({id: userExists.id, email: userExists.email}, JWT_SECRET)
    return NextResponse.json({token})


}