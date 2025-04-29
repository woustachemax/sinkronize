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
  const [otherUsers, setOtherUsers] = useState<{ id: string; username: string; skills: Skill[] }[]>([]);
  const [friends, setFriends] = useState<{ id: string; username: string; skills: Skill[] }[]>([]);
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

      const storedFriends = JSON.parse(localStorage.getItem("friends") || "[]");
      setFriends(storedFriends);

      setLoading(false);

      fetch("/api/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOtherUsers(data.users || []))
        .catch((err) => {
          console.error("Failed to fetch other users", err);
          setLoading(false);
        });

      fetch("/api/user/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const fetchedFriends = data.friends || [];
          setFriends(fetchedFriends);
          localStorage.setItem("friends", JSON.stringify(fetchedFriends)); 
        })
        .catch((err) => {
          console.error("Failed to fetch friends", err);
          setLoading(false);
        });
    }
  }, [router]);

  if (loading) return (
    <div className="text-white text-center">
      Loading ...
    </div>
  );

  return (
    <div className="flex text-white min-h-screen">
      <div className="bg-gray-blacl border-r border-gray-700 py-5 px-4 w-48 flex-shrink-0 flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mb-3">
          <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
            {user?.slice(0, 2).toUpperCase() || "U"}
          </span>
        </div>
        <div className="text-center">
          <div className="text-white mb-0.5 font-bold truncate text-sm hover:drop-shadow-[0px_0px_7px_rgba(252,252,252,0.9)]">
            {user}
          </div>
          <div
            className="text-gray-400 font-semibold text-xs hover:drop-shadow-[0px_0px_7px_rgba(252,252,252,0.9)]"
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            Skills:{" "}
            {skills.length > 0
              ? skills.map((skill) => skill.talents).join(", ")
              : "Skill Issue"}
          </div>
          <div className="text-gray-400 font-semibold my-5 text-sm" 
          onClick={()=>router.push('/chat')}
          >
            Friends : {friends.length}
          </div>
        </div>
      </div>

      <div className="flex-grow p-5">

        <div className="mt-6 grid gap-4">
          {otherUsers.map((otherUser, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-md p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold text-white">
                  {otherUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {otherUser.username}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Skills:{" "}
                    {otherUser.skills.length > 0
                      ? otherUser.skills.map((s) => s.talents).join(", ")
                      : "Skill Issue"}
                  </div>
                </div>
              </div>
              <button className="text-xs border border-white text-white px-3 py-1 rounded-md hover:bg-white hover:text-black"
              onClick={async () => {
                const token = localStorage.getItem("authToken");

                if (!token) {
                  router.push("/login");
                  return;
                }

                try {
                  const response = await fetch("/api/user/friends", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ friendId: otherUser.id }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    alert(data.msg);

                    setFriends((prevFriends) => {
                      const updatedFriends = [...prevFriends, otherUser];
                      localStorage.setItem("friends", JSON.stringify(updatedFriends));
                      return updatedFriends;
                    });

                    setOtherUsers((prevUsers) => prevUsers.filter((u) => u.id !== otherUser.id));

                  } else {
                    alert(data.msg);
                  }
                } catch (err) {
                  console.error("Failed to add friend", err);
                  alert("An error occurred while adding the friend. Please try again.");
                }
              }}
            >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-5 right-10">
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          type="button"
          className="text-white bg-gray-black border-2 border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium rounded-md text-xs p-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span className="sr-only">Logout</span>
        </button>
      </div>
    </div>
  );
}
