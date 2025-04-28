"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function Chat(){
    const [loading, setLoading] = useState(true)


    const router = useRouter();


    useEffect(()=>{ 
        
    const token = localStorage.getItem('authToken')

    if(!token){
        router.push('/login')
    }
    else{
        setLoading(false);
    }}, [router])

    if(loading) return <div className="text-white text-center my-100">
        Loading ...
    </div>

    return <div className="text-white">
        Hi
    </div>
}