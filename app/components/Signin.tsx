"use client"

import { ReactElement, ReactEventHandler, useState} from "react"
// import useNavigate from "react-router-dom" //forgot this is next.js lol
import { useRouter } from "next/router";
import z, { Schema, ZodSchema } from 'zod';


const signupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    skills: z.array(z.string()),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})


export default function Signin(){

    const[inputs, setInputs]= useState({
        email: "",
        password: "",
        skills: [],
    });

    const [errors, setErrors] = useState({});
    // const navigate = useNavigate(); 
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
    };
    const schema = loginSchema || signupSchema;

    let validationResult = schema.safeParse(inputs);

    
    

    




    
    return <div>

    </div>
}