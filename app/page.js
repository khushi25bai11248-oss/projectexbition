import Link from "next/link";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import SkillCard from "@/components/SkillCard";
import Footer from "@/components/Footer";

/* ==========================================
   FEATURES
========================================== */

const features = [
  {
    icon: "🤖",
    title: "AI Skill Assessment",
    description:
      "Take an intelligent assessment that evaluates your current knowledge and identifies your strengths and areas that need improvement.",
  },
  {
    icon: "📚",
    title: "Personalized Resources",
    description:
      "Get learning resources based on your current level instead of following the same learning path as everyone else.",
  },
  {
    icon: "🧑‍🏫",
    title: "Mentor Matching",
    description:
      "Connect with people who have experience in the skill you want to learn and receive personalized guidance.",
  },
  {
    icon: "🔄",
    title: "Skill Swapping",
    description:
      "Share the skills you already know and exchange knowledge with people who want to learn from you.",
  },
];

/* ==========================================
   SKILLS
========================================== */

const skills = [
  {
    icon: "💻",
    name: "Web Development",
    learners: "2.4K",
  },
  {
    icon: "🐍",
    name: "Python",
    learners: "1.8K",
  },
  {
    icon: "🎨",
    name: "UI/UX Design",
    learners: "1.2K",
  },
  {
    icon: "📊",
    name: "Data Science",
    learners: "1.5K",
  },
  {
    icon: "📱",
    name: "App Development",
    learners: "980",
  },
  {
    icon: "🎥",
    name: "Video Editing",
    learners: "760",
  },
];

/* ==========================================
   HOME
========================================== */

export default function Home() {
  return (
    <main className="bg-black">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <Navbar />


      {/* ==========================================
          HERO
      ========================================== */}

      <Hero />


      {/* ==========================================
          HOW IT WORKS
      ========================================== */}

      <section
        id="how-it-works"
        className="relative overflow-hidden bg-[#050509] py-24"
      >

        {/* Background glow */}

        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-700/20 blur-3xl" />

        <div className="pointer-events-none absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-150px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />


        <div className="relative mx-auto max-w-7xl px-6">

          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold tracking-[0.3em] text-blue-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">

              Your learning journey,

              <br />

              <span className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
                simplified.
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              SkillSync combines AI assessment,
              personalized resources and human mentorship
              to help you learn smarter.
            </p>

          </div>


          {/* Steps */}

          <div className="relative mx-auto mt-20 max-w-5xl">

            {/* Connecting line */}

            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600 md:block" />


            <div className="relative grid gap-12 md:grid-cols-4">

              {/* STEP 1 */}

              <div className="group text-center">

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-xl shadow-violet-600/30 transition duration-300 group-hover:scale-110">
                  1
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Choose a Skill
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Select the skill you want to learn.
                </p>

              </div>


              {/* STEP 2 */}

              <div className="group text-center">

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-xl shadow-violet-600/30 transition duration-300 group-hover:scale-110">
                  2
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Take AI Assessment
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  AI evaluates your current knowledge.
                </p>

              </div>


              {/* STEP 3 */}

              <div className="group text-center">

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-xl shadow-violet-600/30 transition duration-300 group-hover:scale-110">
                  3
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Get Your Path
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Receive personalized resources and goals.
                </p>

              </div>


              {/* STEP 4 */}

              <div className="group text-center">

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-xl shadow-violet-600/30 transition duration-300 group-hover:scale-110">
                  4
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Learn With a Mentor
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Connect with someone who can guide you.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          FEATURES
      ========================================== */}

      <section
        id="features"
        className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111936] to-[#160d2d] py-24"
      >

        {/* Background glows */}

        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">

          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold tracking-[0.3em] text-blue-400">
              FEATURES
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">

              Everything you need to{" "}

              <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                grow your skills.
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              SkillSync brings AI-powered learning,
              personalized resources and peer-to-peer
              mentorship together.
            </p>

          </div>


          {/* Feature Cards */}

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">

            {/* CARD 1 */}

            <div className="group rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-900/50 to-blue-900/30 p-7 shadow-xl shadow-violet-900/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-2xl shadow-lg shadow-violet-600/30 transition group-hover:scale-110">
                🤖
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                AI Skill Assessment
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Take an intelligent assessment that evaluates your
                current knowledge and identifies your strengths and
                areas that need improvement.
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />

            </div>


            {/* CARD 2 */}

            <div className="group rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-900/50 to-cyan-900/30 p-7 shadow-xl shadow-blue-900/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl shadow-lg shadow-blue-600/30 transition group-hover:scale-110">
                📚
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Personalized Resources
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Get learning resources based on your current level
                instead of following the same learning path as
                everyone else.
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

            </div>


            {/* CARD 3 */}

            <div className="group rounded-3xl border border-fuchsia-400/20 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/30 p-7 shadow-xl shadow-purple-900/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-fuchsia-400/50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-2xl shadow-lg shadow-purple-600/30 transition group-hover:scale-110">
                🧑‍🏫
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Mentor Matching
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Connect with people who have experience in the skill
                you want to learn and receive personalized guidance.
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />

            </div>


            {/* CARD 4 */}

            <div className="group rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-900/50 to-violet-900/30 p-7 shadow-xl shadow-indigo-900/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-2xl shadow-lg shadow-indigo-600/30 transition group-hover:scale-110">
                🔄
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Skill Swapping
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Share the skills you already know and exchange
                knowledge with people who want to learn from you.
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          SKILLS
      ========================================== */}

      <section
        id="skills"
        className="relative overflow-hidden bg-[#020617] py-24"
      >

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="pointer-events-none absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">

          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold tracking-[0.3em] text-blue-400">
              EXPLORE SKILLS
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              What do you want to learn?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Explore popular skills and find resources,
              mentors and people to learn with.
            </p>

          </div>


          {/* Skill Cards */}

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {skills.map((skill) => (
              <SkillCard
                key={skill.name}
                icon={skill.icon}
                name={skill.name}
                learners={skill.learners}
              />
            ))}

          </div>

        </div>

      </section>


      {/* ==========================================
          FINAL CTA
      ========================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-blue-600 to-blue-500 py-24">

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Ready to discover your potential?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Take your first AI-powered skill assessment
            and start learning with SkillSync.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:bg-slate-100"
          >
            Start Your Journey →
          </Link>

        </div>

      </section>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <Footer />

    </main>
  );
}