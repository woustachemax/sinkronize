"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, signupSchema } from "../lib/schema";
// import NextAuth from "next-auth" //for some other time 


type AuthType = "login" | "signup";

interface Inputs {
  email: string;
  password: string;
  skills?: string[];
  username?: string;
}

interface Errors {
  [key: string]: string;
}

export default function Signin({ type }: { type: AuthType }) {
  const [inputs, setInputs] = useState<Inputs>({
    email: "",
    password: "",
    ...(type === "signup" && { skills: [], username: "" }),
  });

  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prevInputs => ({ ...prevInputs, skills: [e.target.value] }));
  };

  const handleSkillsBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newSkills = e.target.value.split(",").map((skill) => skill.trim()).filter(skill => skill !== "");
    setInputs({ ...inputs, skills: newSkills });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const schema = type === "signup" ? signupSchema : loginSchema;
    const endpoint = type === "signup" ? "/api/user/signup" : "/api/user/login";

    const validationResult = schema.safeParse(inputs);

    if (!validationResult.success) {
      const fieldErrors: Errors = {};
      validationResult.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
//localhost:300/endpoint gave cors error, wow so unexpected
    try {
      const response = await fetch(`${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.jwt || data.token);
        localStorage.setItem("username",data.username );
        localStorage.setItem("skills", JSON.stringify(data.skills));
        router.push("/home");
      } else {
        setErrors({ general: data.message || "Authentication failed" });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred." });
    }
  };

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <form
          className="text-gray-300 shadow-white justify-center w-full max-w-md "
          onSubmit={handleSubmit}
        >
          <div className="font-extrabold text-3xl mb-2 text-center">
            {type === "login" ? "Welcome Back" : "Create an Account"}
          </div>
          <div className="text-gray-500 hover:text-white mb-4 text-center">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              className="pl-2 underline text-gray-400 hover:text-white"
              href={type === "login" ? "/signup" : "/login"}
            >
              {type === "login" ? "Sign Up" : "Login"}
            </Link>
          </div>

          {type === "signup" && (
            <Label
              label="Skills"
              placeholder="e.g., React, Node.js, UI/UX"
              value={inputs.skills ? inputs.skills.join(", ") : ""}
              error={errors.skills}
              onChange={handleSkillsChange}
              onBlur={handleSkillsBlur} 
            />
          )}

          {type === "signup" && (
            <Label
              label="Username"
              placeholder="Anton"
              type="username"
              value={inputs.username}
              error={errors.username}
              onChange={(e)=> setInputs({...inputs, username: e.target.value})}
            />
          )}

          <Label
            label="Email"
            placeholder="sid@example.com"
            value={inputs.email}
            error={errors.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          />

          <Label
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={inputs.password}
            error={errors.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />

          {errors.general && (
            <p className="text-red-500 text-sm mt-1">{errors.general}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full border-white border-2 bg-black text-white p-2 rounded-lg hover:bg-white hover:text-black"
          >
            {type === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface LabelProps {
  label: string;
  placeholder: string;
  type?: string ;
  value: string | undefined;  //undefined cause username wont choose a value ffs
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
}

const Label = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  onBlur, 
}: LabelProps) => {
  const id = label.toLowerCase();
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-200"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur} 
        className={`bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
          block w-full p-2.5`}
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};