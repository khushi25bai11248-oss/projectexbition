"use client";

export default function SkillCard({ icon, name, learners }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.10] hover:shadow-xl hover:shadow-blue-900/20">

      {/* Gradient glow */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20" />

      <div className="relative">

        {/* Top row */}
        <div className="flex items-center justify-between">

          {/* Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-xl ring-1 ring-white/10">
            {icon}
          </div>

          {/* Learners */}
          <span className="text-xs font-medium text-slate-400">
            {learners} learners
          </span>

        </div>

        {/* Skill name */}
        <h3 className="mt-6 text-lg font-bold text-white">
          {name}
        </h3>

        {/* Explore */}
        <button className="mt-4 text-sm font-semibold text-blue-400 transition group-hover:text-cyan-300">
          Explore
          <span className="ml-1 transition-transform group-hover:translate-x-1 inline-block">
            →
          </span>
        </button>

      </div>
    </div>
  );
}