"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Skill = {
  talents: string;
};

type OtherUser = {
  id: string;
  username: string;
  skills: Skill[];
};

export default function HomeValidation() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [otherUsers, setOtherUsers] = useState<OtherUser[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [addingFriend, setAddingFriend] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
      return;
    }
    
    const storedUser = localStorage.getItem("username") || "";
    const storedUserId = localStorage.getItem("userId") || "";
    const storedSkills = JSON.parse(localStorage.getItem("skills") || "[]");

    setUser(storedUser);
    setUserId(storedUserId);
    setSkills(storedSkills);
    
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      console.log("Fetching users with token:", token.substring(0, 10) + "...");
      
      const usersResponse = await fetch("/api/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Users response status:", usersResponse.status);
      
      if (!usersResponse.ok) {
        const errorText = await usersResponse.text();
        console.error("Users response error:", errorText);
        setError(`Failed to fetch users: ${usersResponse.status}`);
        setLoading(false);
        return;
      }
      
      const usersData = await usersResponse.json();
      console.log("Users data:", usersData);
      
      setOtherUsers(usersData.users || []);
      
      console.log("Fetching friends count");
      const friendsCountResponse = await fetch("/api/user/friends/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (friendsCountResponse.ok) {
        const friendsCountData = await friendsCountResponse.json();
        console.log("Friends count data:", friendsCountData);
        setFriendsCount(friendsCountData.count || 0);
      } else {
        console.error("Failed to fetch friends count:", friendsCountResponse.status);
      }
      
      setError(null);
    } catch (error) {
      console.error("Error during data fetching:", error);
      setError("Failed to fetch data. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (otherUser: OtherUser) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId || userId === otherUser.id) {
      console.error("Invalid state for adding friend");
      return;
    }

    setAddingFriend(otherUser.id);

    try {
      console.log("Sending add friend request for:", otherUser.id);
      const res = await fetch("/api/user/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friendId: otherUser.id }),
      });

      console.log("Add friend response status:", res.status);

      const responseText = await res.text();
      console.log("Add friend response text:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.log("Response is not JSON:", responseText);
      }

      if (!res.ok) {
        console.error("Add friend error:", result || responseText);
        alert(`Failed to add friend: ${res.status} - ${result?.msg || responseText}`);
        return;
      }

      console.log("Friend added successfully:", result);
      alert(`Friend added: ${otherUser.username}`);
      
      setOtherUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== otherUser.id)
      );
      
      setFriendsCount((prevCount) => prevCount + 1);
    } catch (err) {
      console.error("Add friend exception:", err);
      alert("Something went wrong when adding friend!");
    } finally {
      setAddingFriend(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white p-4">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => {
            const token = localStorage.getItem("authToken");
            if (token) {
              setLoading(true);
              setError(null);
              fetchData(token);
            } else {
              router.push("/login");
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="px-4 py-2 mt-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
        >
          Logout
        </button>
      </div>
    );
  }

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
              : "No skills"}
          </div>
          <div className="text-gray-400 font-semibold text-xs my-5">
            Friends: {friendsCount}
          </div>
        </div>
      </div>

      <div className="flex-grow p-5">
        <div className="mt-6 grid gap-4">
          {otherUsers.length > 0 ? (
            otherUsers.map((otherUser, index) => (
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
                        : "No skills"}
                    </div>
                  </div>
                </div>
                <button
                  className={`text-xs border border-white text-white px-3 py-1 rounded-md ${
                    addingFriend === otherUser.id 
                      ? "bg-gray-700 opacity-50 cursor-not-allowed" 
                      : "hover:bg-white hover:text-black"
                  }`}
                  onClick={() => handleAddFriend(otherUser)}
                  disabled={addingFriend === otherUser.id}
                >
                  {addingFriend === otherUser.id ? "Adding..." : "Add Friend"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No other users found
            </div>
          )}
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