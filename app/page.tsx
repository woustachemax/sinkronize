import Intro from "./components/Intro";
import "./globals.css";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Intro />
      </div>
      <footer className="text-center lg:text-left mt-auto">
        <div className="bg-black/5 p-4 text-center text-surface dark:text-white">
          © 2025 Copyright: 
          <a href="https://woustachemax.github.io/portfolio/"> Siddharth Thakkar</a>
        </div>
      </footer>
    </div>
  );
}