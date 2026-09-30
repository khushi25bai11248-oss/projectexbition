export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
                S
              </div>

              <span className="text-xl font-bold">
                SkillSync
              </span>

            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              AI-powered skill learning, mentorship and
              skill swapping — all in one place.
            </p>

          </div>

          {/* Platform */}
          <div>

            <h3 className="font-semibold">
              Platform
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>AI Assessment</p>
              <p>Learning Resources</p>
              <p>Mentor Matching</p>
              <p>Skill Swap</p>
            </div>

          </div>

          {/* Company */}
          <div>

            <h3 className="font-semibold">
              Company
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>About</p>
              <p>How It Works</p>
              <p>Contact</p>
              <p>Privacy</p>
            </div>

          </div>

          {/* CTA */}
          <div>

            <h3 className="font-semibold">
              Start Learning
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Discover your level and start your
              personalized learning journey.
            </p>

            <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-700">
              Get Started
            </button>

          </div>

        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 SkillSync. Learn. Share. Grow.
        </div>

      </div>

    </footer>
  );
}