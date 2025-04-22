"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Skill = {
  talents: string;
};

export default function HomeValidation() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
    } else {
      const storedUser = localStorage.getItem("username") || "";
      const storedSkills = JSON.parse(localStorage.getItem("skills") || "[]");

      setUser(storedUser);
      setSkills(storedSkills);
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div className="flex text-white">
      <div className="flex border-2 border-gray-700 my-10 mx-50 h-75 w-75 rounded-xl">
        <div className="my-5 mx-5 w-full">
          <div className="mr-5 mb-10">
            <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {user?.slice(0, 2).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="max-w-[calc(100% - 40px)]">
            <div className="text-gray-300 mb-2 font-extrabold truncate">
              Username: {user}
            </div>
            <div
              className="text-gray-300 font-extrabold"
              style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            >
              Skills:{" "}
              {skills.length > 0
                ? skills.map((skill) => skill.talents).join(", ")
                : "No skills listed"}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 my-5 mx-50">
        <button
          onClick={() => {
            localStorage.clear(); 
            router.push("/");
          }}
          type="button"
          className="text-black bg-gray-200 hover:bg-black border-2 border-white hover:text-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
