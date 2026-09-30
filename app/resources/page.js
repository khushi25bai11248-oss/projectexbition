"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const resources = {
  Beginner: [
    {
      title: "HTML & CSS Fundamentals",
      type: "Course",
      description:
        "Learn the basic structure of webpages and how CSS is used to style them.",
      duration: "4 hours",
      icon: "🌐",
    },
    {
      title: "JavaScript Basics",
      type: "Tutorial",
      description:
        "Understand variables, functions, conditions, loops and basic JavaScript.",
      duration: "5 hours",
      icon: "⚡",
    },
    {
      title: "Build Your First Web Page",
      type: "Project",
      description:
        "Create a simple responsive webpage using HTML and CSS.",
      duration: "2 hours",
      icon: "🚀",
    },
  ],

  Intermediate: [
    {
      title: "Modern JavaScript",
      type: "Course",
      description:
        "Improve your JavaScript knowledge with arrays, objects, functions and APIs.",
      duration: "6 hours",
      icon: "⚡",
    },
    {
      title: "React Fundamentals",
      type: "Course",
      description:
        "Learn components, props, state and basic React application development.",
      duration: "7 hours",
      icon: "⚛️",
    },
    {
      title: "Build a Full Stack Project",
      type: "Project",
      description:
        "Combine frontend and backend concepts to create a complete application.",
      duration: "10 hours",
      icon: "💻",
    },
  ],

  Advanced: [
    {
      title: "Advanced React",
      type: "Course",
      description:
        "Explore advanced React patterns, performance and application architecture.",
      duration: "8 hours",
      icon: "⚛️",
    },
    {
      title: "Next.js Application Development",
      type: "Project",
      description:
        "Build production-style applications using Next.js.",
      duration: "10 hours",
      icon: "▲",
    },
    {
      title: "Advanced Full Stack Project",
      type: "Project",
      description:
        "Build a complete application with authentication, APIs and database integration.",
      duration: "15 hours",
      icon: "🚀",
    },
  ],
};

export default function ResourcesPage() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const savedUser = localStorage.getItem("skillsyncUser");
        const token = localStorage.getItem("skillsyncToken");

        // Check login information
        if (!savedUser || !token) {
          window.location.href = "/login";
          return;
        }

        const user = JSON.parse(savedUser);

        if (!user.id) {
          window.location.href = "/login";
          return;
        }

        // JWT protected request
        const response = await fetch(
          `http://127.0.0.1:5000/api/assessment/user/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Token expired or invalid
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("skillsyncUser");
          localStorage.removeItem("skillsyncToken");
          localStorage.removeItem("skillsyncLoggedIn");

          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          setMessage(
            data.message || "Unable to load assessment."
          );
          setLoading(false);
          return;
        }

        // No assessment found
        if (!data || data.length === 0) {
          window.location.href = "/assessment";
          return;
        }

        // Latest assessment
        const latestAssessment = data[0];

        setAssessment({
          skill: latestAssessment.skill,
          score: latestAssessment.score,
          level: latestAssessment.level,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);

        setMessage(
          "Cannot connect to backend. Make sure the backend is running."
        );

        setLoading(false);
      }
    };

    loadAssessment();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading your personalized resources...
        </p>
      </main>
    );
  }

  if (message) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-red-600">
          {message}
        </p>
      </main>
    );
  }

  if (!assessment) {
    return null;
  }

  const recommendedResources =
    resources[assessment.level] || resources.Beginner;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            SkillSync
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="text-center">

          <p className="font-semibold text-blue-600">
            Personalized Learning
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Your Learning Path
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            SkillSync has analyzed your assessment and selected
            resources according to your current skill level.
          </p>

        </div>

        {/* Assessment Summary */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

          <div className="grid gap-6 sm:grid-cols-3">

            <div>
              <p className="text-sm text-slate-500">
                Skill
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {assessment.skill}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Assessment Score
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {assessment.score}%
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Level
              </p>

              <p className="mt-1 text-xl font-bold text-blue-600">
                {assessment.level}
              </p>
            </div>

          </div>

        </div>

        {/* Recommended Resources */}
        <div className="mt-12">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Recommended for You
            </h2>

            <p className="mt-2 text-slate-600">
              These resources are selected for your{" "}
              <span className="font-semibold">
                {assessment.level}
              </span>{" "}
              level.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {recommendedResources.map((resource, index) => (

              <div
                key={index}
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-center justify-between">

                  <div className="text-4xl">
                    {resource.icon}
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {resource.type}
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {resource.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  {resource.description}
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    ⏱ {resource.duration}
                  </span>

                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={() =>
                      alert(`Opening ${resource.title}`)
                    }
                  >
                    Start
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Learning Path */}
        <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Your Recommended Path
          </h2>

          <p className="mt-2 text-slate-600">
            Follow these stages to improve your {assessment.skill} skills.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-bold text-blue-600">
                01
              </p>

              <p className="mt-2 font-semibold">
                Learn Fundamentals
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <p className="font-bold text-purple-600">
                02
              </p>

              <p className="mt-2 font-semibold">
                Practice
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="font-bold text-green-600">
                03
              </p>

              <p className="mt-2 font-semibold">
                Build Projects
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-5">
              <p className="font-bold text-orange-600">
                04
              </p>

              <p className="mt-2 font-semibold">
                Get Mentor Support
              </p>
            </div>

          </div>

        </div>

        {/* Mentor CTA */}
        <div className="mt-12 rounded-3xl bg-blue-600 p-8 text-center text-white">

          <h2 className="text-2xl font-bold">
            Need help along the way?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Connect with someone who already knows the skill
            you're trying to learn.
          </p>

          <Link
            href="/mentors"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
          >
            Find a Mentor →
          </Link>

        </div>

      </section>

    </main>
  );
}