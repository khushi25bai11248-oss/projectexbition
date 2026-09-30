"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          {/* Logo Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-lg shadow-blue-900/30">
            ⇄
          </div>

          {/* Logo Text */}
          <span className="text-2xl font-bold tracking-tight text-white">
            Skill
            <span className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
              Sync
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-9 md:flex">

          <Link
            href="/"
            className="text-sm font-medium text-white transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="#skills"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Skills
          </Link>

          <Link
            href="#mentors"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Mentors
          </Link>

          <Link
            href="#resources"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Resources
          </Link>

          <Link
            href="#about"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            About
          </Link>

        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="rounded-xl border border-white/30 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </nav>
  );
}