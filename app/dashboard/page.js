"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    teachSkills: [],
    learnSkills: [],
    level: "Beginner",
  });

  const [matchCount, setMatchCount] = useState(0);

  // Skill Exchange requests
  const [pendingCount, setPendingCount] = useState(0);

  // Mentor requests
  const [mentorRequests, setMentorRequests] = useState([]);
  const [mentorPendingCount, setMentorPendingCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // =============================
  // LOAD USER
  // =============================

  useEffect(() => {
    const token = localStorage.getItem("skillsyncToken");
    const storedUser = localStorage.getItem("skillsyncUser");

    if (!token || !storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.id) {
        alert("User ID missing. Please login again.");
        window.location.href = "/login";
        return;
      }

      setUser(parsedUser);

      loadDashboardData(parsedUser.id, token);
    } catch (error) {
      console.error("User data error:", error);
      window.location.href = "/login";
    }
  }, []);

  // =============================
  // LOAD DASHBOARD DATA
  // =============================

  const loadDashboardData = async (userId, token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [
        profileResponse,
        matchResponse,
        requestResponse,
        mentorRequestResponse,
      ] = await Promise.all([
        // Profile
        fetch(`${API_URL}/api/profile/${userId}`, {
          headers,
        }),

        // Skill Exchange Matches
        fetch(`${API_URL}/api/skill-exchange/${userId}`, {
          headers,
        }),

        // Skill Exchange Received Requests
        fetch(
          `${API_URL}/api/skill-exchange/requests/received/${userId}`,
          {
            headers,
          }
        ),

        // Mentor Requests
        fetch(
          `${API_URL}/api/mentor-request/learner/${userId}`,
          {
            headers,
          }
        ),
      ]);

      // =============================
      // CHECK TOKEN
      // =============================

      if (
        profileResponse.status === 401 ||
        profileResponse.status === 403 ||
        matchResponse.status === 401 ||
        matchResponse.status === 403 ||
        requestResponse.status === 401 ||
        requestResponse.status === 403 ||
        mentorRequestResponse.status === 401 ||
        mentorRequestResponse.status === 403
      ) {
        localStorage.removeItem("skillsyncToken");
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncLoggedIn");

        window.location.href = "/login";
        return;
      }

      // =============================
      // GET RESPONSES
      // =============================

      const profileData = await profileResponse.json();
      const matchData = await matchResponse.json();
      const requestData = await requestResponse.json();
      const mentorRequestData =
        await mentorRequestResponse.json();

      // =============================
      // PROFILE
      // =============================

      if (profileResponse.ok) {
        setProfile({
          teachSkills: profileData.teachSkills || [],
          learnSkills: profileData.learnSkills || [],
          level: profileData.level || "Beginner",
        });
      }

      // =============================
      // SKILL MATCHES
      // =============================

      if (matchResponse.ok) {
        setMatchCount(
          Array.isArray(matchData)
            ? matchData.length
            : 0
        );
      }

      // =============================
      // SKILL EXCHANGE REQUESTS
      // =============================

      if (requestResponse.ok) {
        const requests = Array.isArray(requestData)
          ? requestData
          : [];

        const pendingRequests = requests.filter(
          (request) =>
            request.status === "Pending"
        );

        setPendingCount(
          pendingRequests.length
        );
      }

      // =============================
      // MENTOR REQUESTS
      // =============================

      if (mentorRequestResponse.ok) {
        const requests = Array.isArray(
          mentorRequestData
        )
          ? mentorRequestData
          : mentorRequestData.requests || [];

        setMentorRequests(requests);

        const pendingMentorRequests =
          requests.filter(
            (request) =>
              request.status === "Pending"
          );

        setMentorPendingCount(
          pendingMentorRequests.length
        );
      }
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // LOGOUT
  // =============================

  function handleLogout() {
    localStorage.removeItem("skillsyncToken");
    localStorage.removeItem("skillsyncLoggedIn");
    localStorage.removeItem("skillsyncUser");

    window.location.href = "/login";
  }

  // =============================
  // STATUS STYLE
  // =============================

  function getStatusStyle(status) {
    if (status === "Accepted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  // =============================
  // LOADING
  // =============================

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">
          Loading SkillSync...
        </p>
      </div>
    );
  }

  // =============================
  // DASHBOARD
  // =============================

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

          <div className="flex items-center gap-5">

            <Link
              href="/profile"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Profile
            </Link>

            <Link
              href="/skill-exchange"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Skill Exchange
            </Link>

            <Link
              href="/skill-requests"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Requests
            </Link>

            <Link
              href="/mentor-request"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Mentor
            </Link>

            <span className="hidden text-sm text-slate-600 md:block">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>

      {/* Main */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Welcome */}

        <div className="mb-10">

          <p className="font-semibold text-blue-600">
            Welcome to SkillSync 👋
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Hello, {user.name}!
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Continue your learning journey, connect
            with mentors, and exchange skills with
            other learners.
          </p>

        </div>

        {/* Profile Summary */}

        <div className="mb-8 grid gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Skill Level
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {profile.level}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Skills I Teach
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {profile.teachSkills.length}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Skills I Want to Learn
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-600">
              {profile.learnSkills.length}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Skill Matches
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {matchCount}
            </p>

          </div>

        </div>

        {/* Skills */}

        <div className="mb-10 grid gap-6 md:grid-cols-2">

          {/* Teach */}

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Skills You Can Teach
            </h2>

            {profile.teachSkills.length === 0 ? (

              <p className="mt-4 text-slate-500">
                You have not added any teaching skills yet.
              </p>

            ) : (

              <div className="mt-4 flex flex-wrap gap-2">

                {profile.teachSkills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            )}

          </div>

          {/* Learn */}

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Skills You Want to Learn
            </h2>

            {profile.learnSkills.length === 0 ? (

              <p className="mt-4 text-slate-500">
                You have not added any learning skills yet.
              </p>

            ) : (

              <div className="mt-4 flex flex-wrap gap-2">

                {profile.learnSkills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* Learn */}

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <div className="mb-5 text-4xl">
              🎯
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Learn a Skill
            </h2>

            <p className="mt-3 text-slate-600">
              Choose a skill you want to learn and start
              your personalized learning journey.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Start Learning
            </Link>

          </div>

          {/* Assessment */}

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <div className="mb-5 text-4xl">
              🤖
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              AI Skill Assessment
            </h2>

            <p className="mt-3 text-slate-600">
              Evaluate your current knowledge and
              identify your starting skill level.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
            >
              Take Assessment
            </Link>

          </div>

          {/* Skill Exchange */}

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <div className="mb-5 text-4xl">
              🔄
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Skill Exchange
            </h2>

            <p className="mt-3 text-slate-600">
              Find people who can teach what you want
              to learn and learn from you in return.
            </p>

            <Link
              href="/skill-exchange"
              className="mt-6 inline-block rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
            >
              Find Matches
            </Link>

          </div>

        </div>

        {/* =============================
            MENTOR REQUESTS
        ============================= */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Mentor Requests
              </h2>

              <p className="mt-2 text-slate-600">

                You have{" "}
                <strong>
                  {mentorPendingCount}
                </strong>{" "}
                pending mentor request
                {mentorPendingCount !== 1
                  ? "s"
                  : ""}.

              </p>

            </div>

            <Link
              href="/mentor-request"
              className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              View Mentor Requests
            </Link>

          </div>


          {/* No mentor requests */}

          {mentorRequests.length === 0 ? (

            <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">

              <p className="text-slate-500">
                You have not sent any mentor requests yet.
              </p>

              <Link
                href="/mentors"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Find a Mentor →
              </Link>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {mentorRequests.map((request) => (

                <div
                  key={request._id}
                  className="rounded-xl border border-slate-200 p-5"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h3 className="text-lg font-bold text-slate-900">

                        {request.mentorId?.name ||
                          "Mentor"}

                      </h3>

                      <p className="mt-1 text-slate-600">

                        Skill:{" "}
                        <span className="font-semibold">
                          {request.skill}
                        </span>

                      </p>

                      <p className="mt-1 text-sm text-slate-500">

                        Level: {request.level}
                        {" • "}
                        Score: {request.score}

                      </p>

                    </div>


                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =============================
            SKILL EXCHANGE REQUESTS
        ============================= */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Skill Exchange Requests
              </h2>

              <p className="mt-2 text-slate-600">

                You currently have{" "}
                <strong>
                  {pendingCount}
                </strong>{" "}
                pending request
                {pendingCount !== 1
                  ? "s"
                  : ""}.

              </p>

            </div>

            <Link
              href="/skill-requests"
              className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              View Requests
            </Link>

          </div>

        </div>


        {/* =============================
            LEARNING JOURNEY
        ============================= */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Your Learning Journey
          </h2>

          <p className="mt-2 text-slate-600">
            Follow these steps to build your skills
            with SkillSync.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            <div className="rounded-xl bg-blue-50 p-5">

              <p className="text-sm font-semibold text-blue-600">
                Step 1
              </p>

              <p className="mt-2 font-bold">
                Choose Skill
              </p>

            </div>

            <div className="rounded-xl bg-purple-50 p-5">

              <p className="text-sm font-semibold text-purple-600">
                Step 2
              </p>

              <p className="mt-2 font-bold">
                AI Assessment
              </p>

            </div>

            <div className="rounded-xl bg-green-50 p-5">

              <p className="text-sm font-semibold text-green-600">
                Step 3
              </p>

              <p className="mt-2 font-bold">
                Learning Resources
              </p>

            </div>

            <div className="rounded-xl bg-orange-50 p-5">

              <p className="text-sm font-semibold text-orange-600">
                Step 4
              </p>

              <p className="mt-2 font-bold">
                Mentor Support
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}