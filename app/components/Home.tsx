"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Inputs {
    email: string;
    password: string;
    skills: string[];
  }

  
export default function HomeValidation(){
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    // const [inputs, setInputs] = useStat() not needed as of now


    useEffect(()=>{
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.push("/login"); 
          } 
          else{
            setLoading(false)
          }
    },[])

    if(loading == true ) return null;


    return <div className="text-white">
        
    </div>
}