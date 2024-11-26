"use client";
import React from "react";
import Befolkning from "./(pages)/befolkning";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <nav className="w-full py-6 px-4 bg-slate-900 text-white flex justify-between">
        <h4 className="text-lg leading-none">
          <strong>Konciv</strong> Case
        </h4>

        <Link
          href="https://github.com/kristian-koningsberg"
          target="_blank"
          className="scale-100 transition-all hover:scale-110">
          <FaGithub className="text-2xl ml-auto" />
        </Link>
      </nav>
      <Befolkning />
    </div>
  );
}
