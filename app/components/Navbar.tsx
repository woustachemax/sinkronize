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
    <nav className="bg-black drop-shadow-glow border-b-1 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={() => router.push("/home")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 text-white drop-shadow-[0px_0px_7px_rgba(252,252,252,0.9)]">
                <Brain />
              </div>
              <div className="font-extrabold text-lg text-white drop-shadow-[0px_0px_7px_rgba(252,252,252,0.9)]">Sinkronize</div>
            </div>
          </div>
          <div className=" drop-shadow-glow hidden md:flex items-center space-x-4">
            <button
              type="button"
              className="text-white font-extrabold hover:text-gray-200"
              onClick={() => router.push("/home")}
            >
              Home
            </button>
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-white dark:bg-white dark:text-black dark:border-gray-400 dark:hover:text-white dark:hover:bg-black drop-shadow-glow"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium  ocus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-black dark:bg-black dark:text-white dark:border-white dark:hover:text-black dark:hover:bg-white drop-shadow-glow"
              onClick={() => router.push("/login")}

            >
              Login
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none  "
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
              router.push("/home");
              setIsMobileMenuOpen(false);
            }}
            className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => {
              router.push("/signup");
              setIsMobileMenuOpen(false)}}
            className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white"
          >
            Signup
          </button>
          <button
            onClick={() => {
              router.push("/login");
              setIsMobileMenuOpen(false)}}
            className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}