// import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import client from "@/app/lib/db";
import { signupSchema } from "../../../lib/schema";
import z from 'zod'

// const client = new PrismaClient();



const JWT_SECRET = process.env.JWT_SECRET!;


if(!JWT_SECRET){
    throw new Error("The JWT Secret hasn't been exported for Signup / is not defined in environment variables")
}

//  async function GET(req: NextRequest){
//     const body = await req.json();

//     return NextResponse.json(body)
// }

export async function POST(req: NextRequest){
const body: z.infer<typeof signupSchema> = await req.json()
    const signup = signupSchema.safeParse(body);
    
    if(!signup.success){
        return NextResponse.json({
            msg:"Incorrect Inputs, please check your inputs."
        },
        {status: 411})
    }

    const userExistsByEmail = await client.user.findUnique({
        where:{
            email: body.email
        }
    })

    if(userExistsByEmail){
        return NextResponse.json({
            msg: "User with this email already exists, try logging in."
        },
        {status: 411})
    }

    // Check if a user with the provided username already exists
    const userExistsByUsername = await client.user.findUnique({
        where: {
            username: body.username
        }
    });

    if (userExistsByUsername) {
        return NextResponse.json({
            msg: "This username is already taken, please choose another."
        },
        {status: 411})
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)
    console.log(body.username);

    try{
        const newUser = await client.user.create({
            data: {
              email: body.email,
              password: hashedPassword,
              username: body.username,
              skills: {
                create: body.skills.map((skill) => ({
                  talents: skill,
                })),
              },
            },
            include: {
              skills: true, 
            },
          });
                     
        // if (!body.skills){
        //     return NextResponse.json({msg:"no"})
        // }
        // if(!newUser){
        //     return NextResponse.json({msg:"problem is with schema"})
        // }

        const token = await jwt.sign({id: newUser.id, email: newUser.email}, JWT_SECRET);
        return NextResponse.json({token,
            username: newUser.username,
            skills: newUser.skills
        })
    }
    catch(e){
        return NextResponse.json({msg: "Error while signing up", Error: e},
            {status: 411}
        )
    }

}