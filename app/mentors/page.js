"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000";

export default function Mentors() {
  const router = useRouter();

  const [mentors, setMentors] = useState([]);
  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      const storedUser =
        localStorage.getItem("skillsyncUser");

      const token =
        localStorage.getItem("skillsyncToken");

      const storedAssessment =
        localStorage.getItem("skillsyncAssessment");

      // Check login
      if (!storedUser || !token) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.id) {
        logoutAndRedirect();
        return;
      }

      setUser(parsedUser);

      // Load assessment
      if (storedAssessment) {
        try {
          const parsedAssessment =
            JSON.parse(storedAssessment);

          setAssessment(parsedAssessment);
        } catch (error) {
          console.error(
            "Assessment parse error:",
            error
          );
        }
      }

      // Load mentors
      await loadMentors(token);

    } catch (error) {
      console.error(
        "Initialization error:",
        error
      );

      logoutAndRedirect();
    }
  };

  const logoutAndRedirect = () => {
    localStorage.removeItem("skillsyncUser");
    localStorage.removeItem("skillsyncToken");
    localStorage.removeItem("skillsyncLoggedIn");
    localStorage.removeItem("skillsyncAssessment");
    localStorage.removeItem("skillsyncMentor");

    router.push("/login");
  };

  const loadMentors = async (token) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/mentors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("MENTOR API RESPONSE:", data);

      // JWT error
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logoutAndRedirect();
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load mentors."
        );
        return;
      }

      /*
       * Handle both possible backend responses:
       *
       * 1. { mentors: [...] }
       *
       * 2. [...]
       */
      let mentorList = [];

      if (Array.isArray(data)) {
        mentorList = data;
      } else if (Array.isArray(data.mentors)) {
        mentorList = data.mentors;
      }

      console.log(
        "MENTORS RECEIVED:",
        mentorList
      );

      setMentors(mentorList);

      if (mentorList.length === 0) {
        setMessage(
          "Backend connected, but no mentor records were returned."
        );
      }

    } catch (error) {
      console.error(
        "MENTOR LOAD ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (mentor) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!assessment) {
      setMessage(
        "Please complete the assessment first."
      );
      return;
    }

    const token =
      localStorage.getItem("skillsyncToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setSendingId(mentor._id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/mentor-request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            learnerId: user.id,
            mentorId: mentor._id,
            skill: assessment.skill,
            level: assessment.level,
            score: assessment.score,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "MENTOR REQUEST RESPONSE:",
        data
      );

      // JWT error
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logoutAndRedirect();
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to send mentor request."
        );
        return;
      }

      // Save selected mentor
      localStorage.setItem(
        "skillsyncMentor",
        JSON.stringify(mentor)
      );

      setMessage(
        `Mentor request sent to ${mentor.name}!`
      );

      setTimeout(() => {
        router.push("/mentor-request");
      }, 800);

    } catch (error) {
      console.error(
        "SEND REQUEST ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Finding mentors...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Find a Mentor
          </h1>

          {user && (
            <p className="text-gray-600 mt-2">
              Welcome, {user.name}
            </p>
          )}

          {assessment && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">

              <p className="text-blue-800 font-semibold">
                Your Assessment
              </p>

              <p className="text-blue-700 mt-1">
                Skill: {assessment.skill}
              </p>

              <p className="text-blue-700">
                Level: {assessment.level}
              </p>

              <p className="text-blue-700">
                Score: {assessment.score}
              </p>

            </div>
          )}

        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* Mentor heading */}
        {mentors.length > 0 && (
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Available Mentors
            </h2>

            <p className="text-gray-600 mt-2">
              Choose a mentor who can help you improve your{" "}
              <span className="font-semibold">
                {assessment?.skill || "selected skill"}
              </span>.
            </p>

          </div>
        )}

        {/* No mentors */}
        {mentors.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              No mentors found
            </h2>

            <p className="text-gray-500 mt-2">
              No mentor records were returned by the backend.
            </p>

            <button
              onClick={() =>
                router.push("/assessment")
              }
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Retake Assessment
            </button>

          </div>
        )}

        {/* Mentor cards */}
        {mentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {mentors.map((mentor) => (

              <div
                key={mentor._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >

                <div className="text-5xl mb-4">
                  {mentor.icon || "👨‍🏫"}
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  {mentor.name}
                </h2>

                <p className="text-blue-600 font-semibold mt-1">
                  {mentor.skill}
                </p>

                <p className="text-gray-600 mt-3">
                  <span className="font-semibold">
                    Expertise:
                  </span>{" "}
                  {mentor.expertise}
                </p>

                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">
                    Experience:
                  </span>{" "}
                  {mentor.experience}
                </p>

                <p className="text-gray-500 mt-4 text-sm leading-6">
                  {mentor.description}
                </p>

                <button
                  onClick={() =>
                    sendRequest(mentor)
                  }
                  disabled={
                    sendingId === mentor._id
                  }
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {sendingId === mentor._id
                    ? "Sending..."
                    : "Request Mentor"}
                </button>

              </div>

            ))}

          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-6 mt-8">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() =>
              router.push("/mentor-request")
            }
            className="text-blue-600 hover:underline"
          >
            View Mentor Request →
          </button>

        </div>

      </div>

    </div>
  );
}