"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000";

export default function SkillExchange() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState(null);

  // ==========================================
  // CHECK LOGIN + LOAD MATCHES
  // ==========================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("skillsyncUser");

    const token =
      localStorage.getItem("skillsyncToken");

    if (!storedUser || !token) {
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.id) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");

        window.location.href = "/login";
        return;
      }

      setUser(parsedUser);
      loadMatches(parsedUser.id, token);

    } catch (error) {
      console.error(error);

      localStorage.removeItem("skillsyncUser");
      localStorage.removeItem("skillsyncToken");

      window.location.href = "/login";
    }
  }, []);

  // ==========================================
  // LOAD MATCHES
  // ==========================================

  const loadMatches = async (userId, token) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/skill-exchange/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");

        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to find matches."
        );
        return;
      }

      if (Array.isArray(data)) {
        setMatches(data);
      } else {
        setMatches(data.matches || []);
      }

    } catch (error) {
      console.error(
        "Match error:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND EXCHANGE REQUEST
  // ==========================================

  const sendRequest = async (match) => {
    if (!user) {
      setMessage("Please login first.");
      return;
    }

    const token =
      localStorage.getItem("skillsyncToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    /*
      IMPORTANT:

      The matched user's data tells us exactly
      what the exchange should be.

      Example:

      Other user:
      teachSkills = ["JavaScript"]
      learnSkills = ["Python"]

      Current user must:
      teach Python
      learn JavaScript
    */

    const skillToTeach =
      match.learnSkills?.[0];

    const skillToLearn =
      match.teachSkills?.[0];

    if (!skillToTeach || !skillToLearn) {
      setMessage(
        "Compatible skills could not be determined."
      );
      return;
    }

    try {
      setSendingId(match.userId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/skill-exchange/request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            senderId: user.id,
            receiverId: match.userId,
            skillToTeach,
            skillToLearn,
          }),
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");

        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Request failed."
        );
        return;
      }

      setMessage(
        `Exchange request sent to ${match.name}!`
      );

    } catch (error) {
      console.error(
        "Send request error:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );

    } finally {
      setSendingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <p className="text-lg text-gray-600">
          Finding skill exchange matches...
        </p>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Skill Exchange
          </h1>

          {user && (
            <p className="text-gray-600 mt-2">
              Welcome, {user.name}
            </p>
          )}

          <p className="text-gray-500 mt-2">
            Find users whose skills match what you
            want to learn and teach.
          </p>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* NO MATCHES */}

        {matches.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              No skill matches found
            </h2>

            <p className="text-gray-500 mt-2">
              Try updating your teach and learn
              skills in your profile.
            </p>

            <Link
              href="/profile"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </Link>

          </div>
        )}

        {/* MATCHES */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {matches.map((match) => (

            <div
              key={match.userId}
              className="bg-white rounded-xl shadow-md p-6"
            >

              {/* USER */}

              <h2 className="text-2xl font-bold text-gray-800">
                {match.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {match.email}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Level: {match.level}
              </p>

              {/* CAN TEACH ME */}

              <div className="mt-5">

                <h3 className="font-semibold text-green-700">
                  Skills They Can Teach
                </h3>

                <div className="flex flex-wrap gap-2 mt-2">

                  {match.teachSkills?.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* SKILLS THEY WANT */}

              <div className="mt-4">

                <h3 className="font-semibold text-blue-700">
                  Skills They Want to Learn
                </h3>

                <div className="flex flex-wrap gap-2 mt-2">

                  {match.learnSkills?.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* REQUEST */}

              <button
                onClick={() =>
                  sendRequest(match)
                }
                disabled={
                  sendingId === match.userId
                }
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {sendingId === match.userId
                  ? "Sending..."
                  : "Send Exchange Request"}
              </button>

            </div>

          ))}

        </div>

        {/* LINKS */}

        <div className="flex justify-center gap-6 mt-8">

          <Link
            href="/profile"
            className="text-blue-600 hover:underline"
          >
            ← Back to Profile
          </Link>

          <Link
            href="/skill-requests"
            className="text-blue-600 hover:underline"
          >
            View Requests →
          </Link>

        </div>

      </div>

    </div>
  );
}