"use client";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-200 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 text-black">
                <Brain />
              </div>
              <div className="font-extrabold text-lg text-black">SkillSync</div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              className="text-black font-extrabold hover:text-gray-400"
              onClick={() => router.push("/")}   
            >
              Home
            </button>
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-600 dark:text-white dark:border-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Signup
            </button>
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              Login
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-gray-100 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      
      <div className={isMobileMenuOpen ? "md:hidden block" : "md:hidden hidden"}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            onClick={() => {
              router.push("/");
              setIsMobileMenuOpen(false);
            }}
            className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 hover:text-gray-800"
          >
            Home
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)} // Add signup logic if needed
            className="text-gray-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 hover:text-gray-800"
          >
            Signup
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)} // Add login logic if needed
            className="text-gray-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 hover:text-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}