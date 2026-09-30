"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-[calc(100vh-73px)] min-h-[700px] overflow-hidden bg-black"
    >

      {/* ================= BACKGROUND IMAGE ================= */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/home.png')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Darker left side for readable text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />


      {/* ================= HERO CONTENT ================= */}

      <div className="relative z-10 flex h-full w-full items-center">

        {/* IMPORTANT:
            No max-w-7xl here.
            This makes the content start from the left side.
        */}

        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">

          <div className="max-w-[700px]">

            {/* Small heading */}

            <p className="mb-6 text-sm font-semibold tracking-[0.35em] text-blue-300 md:text-base">
              LEARN&nbsp;&nbsp;+&nbsp;&nbsp;TEACH&nbsp;&nbsp;+&nbsp;&nbsp;GROW
            </p>


            {/* Main heading */}

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl">

              Swap Skills,

              <br />

              <span className="bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Build Your Future
              </span>

            </h1>


            {/* Description */}

            <p className="mt-7 max-w-[650px] text-lg leading-8 text-slate-200 md:text-xl">

              SkillSync uses AI to understand your current skill level,
              create a personalized learning path, and connect you with
              people who can help you grow.

            </p>


            {/* Buttons */}

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                href="/skill-exchange"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-900/40 transition duration-300 hover:-translate-y-1"
              >
                Start Learning
                <span className="ml-2">→</span>
              </Link>


              <Link
                href="#skills"
                className="rounded-xl border border-white/30 bg-black/20 px-7 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/10"
              >
                Explore Skills
              </Link>

            </div>


            {/* Statistics */}

            <div className="mt-10 flex flex-wrap gap-10">

              <div>
                <p className="text-2xl font-bold text-white">
                  100+
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Skills
                </p>
              </div>


              <div>
                <p className="text-2xl font-bold text-white">
                  AI
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Assessment
                </p>
              </div>


              <div>
                <p className="text-2xl font-bold text-white">
                  1:1
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Mentorship
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}