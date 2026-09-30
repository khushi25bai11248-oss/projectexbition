"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000";

export default function MentorRequest() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("skillsyncUser");
    const token = localStorage.getItem("skillsyncToken");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.id) {
        logoutAndRedirect();
        return;
      }

      setUser(parsedUser);
      loadRequests(parsedUser.id, token);

    } catch (error) {
      console.error("LOGIN DATA ERROR:", error);
      logoutAndRedirect();
    }
  }, [router]);


  const logoutAndRedirect = () => {
    localStorage.removeItem("skillsyncUser");
    localStorage.removeItem("skillsyncToken");
    localStorage.removeItem("skillsyncLoggedIn");
    localStorage.removeItem("skillsyncAssessment");
    localStorage.removeItem("skillsyncMentor");

    router.push("/login");
  };


  const loadRequests = async (userId, token) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/mentor-request/learner/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("MENTOR REQUEST API RESPONSE:", data);

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
            "Unable to load mentor requests."
        );
        return;
      }

      /*
        Backend returns the requests directly:

        [
          {
            _id: "...",
            mentorId: {...},
            status: "Pending"
          }
        ]

        Therefore data itself is the array.
      */

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
        setRequests([]);
      }

    } catch (error) {
      console.error(
        "LOAD MENTOR REQUEST ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading mentor requests...
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Mentor Request
          </h1>

          {user && (
            <p className="text-gray-600 mt-2">
              {user.name}
            </p>
          )}

        </div>


        {/* Message */}

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}


        {/* No requests */}

        {requests.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              No mentor requests
            </h2>

            <p className="text-gray-500 mt-2">
              You have not sent any mentor requests yet.
            </p>

            <button
              onClick={() =>
                router.push("/mentors")
              }
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Find a Mentor
            </button>

          </div>
        )}


        {/* Requests */}

        {requests.length > 0 && (
          <div className="space-y-6">

            {requests.map((request) => {

              const mentor = request.mentorId;

              return (
                <div
                  key={request._id}
                  className="bg-white rounded-xl shadow-md p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Mentor information */}

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="text-4xl">
                          {mentor?.icon || "👨‍🏫"}
                        </span>

                        <div>

                          <h2 className="text-2xl font-bold text-gray-800">
                            {mentor?.name || "Mentor"}
                          </h2>

                          <p className="text-blue-600 font-semibold">
                            {request.skill}
                          </p>

                        </div>

                      </div>


                      {mentor && (
                        <p className="text-gray-500 mt-3">
                          {mentor.expertise}
                        </p>
                      )}

                    </div>


                    {/* Status */}

                    <div>

                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          request.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                  </div>


                  {/* Assessment information */}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-sm text-gray-500">
                        Your Level
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {request.level}
                      </p>

                    </div>


                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-sm text-gray-500">
                        Assessment Score
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {request.score}
                      </p>

                    </div>

                  </div>


                  {/* Request date */}

                  <p className="text-sm text-gray-400 mt-5">
                    Request sent:{" "}
                    {new Date(
                      request.createdAt
                    ).toLocaleString()}
                  </p>

                </div>
              );

            })}

          </div>
        )}


        {/* Navigation */}

        <div className="flex justify-center gap-6 mt-8">

          <button
            onClick={() =>
              router.push("/mentors")
            }
            className="text-blue-600 hover:underline"
          >
            ← Find More Mentors
          </button>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}