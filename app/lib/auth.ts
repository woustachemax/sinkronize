import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import client from "./db";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({ 
            name: "signin",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "sid@example.com"
                },
                password: { type: "password", label: "Password" },
                skills: { label: "skills", type: "string" } 
            },
            async authorize(credentials) {
                
                if (!credentials || credentials.email || credentials.password)
                return null;
                
                const dbUser = await client.user.findFirst({
                    where:{
                        email: credentials.email
                    }
                })
                if (!dbUser) {
                    return null; 
                }

                const unhashedPd = await bcrypt.compare(credentials.password, dbUser?.password)

                if(dbUser && unhashedPd){
                    const {password, id, ...dbUserwithoutPassword} = dbUser
                    return dbUserwithoutPassword as User;
                }

                return null;


            }
        }),
    
    ],
};