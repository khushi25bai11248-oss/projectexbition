"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000";

export default function MentorDashboard() {
  const router = useRouter();

  const [mentor, setMentor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    initializePage();
  }, []);


  const initializePage = async () => {
    try {
      const storedMentor =
        localStorage.getItem("skillsyncMentor");

      const token =
        localStorage.getItem("skillsyncToken");

      /*
        Check login
      */

      if (!token) {
        router.push("/login");
        return;
      }

      /*
        Check selected mentor
      */

      if (!storedMentor) {
        setMessage(
          "No mentor selected. Please select a mentor first."
        );
        setLoading(false);
        return;
      }

      const parsedMentor =
        JSON.parse(storedMentor);

      if (!parsedMentor._id) {
        setMessage("Mentor ID missing.");
        setLoading(false);
        return;
      }

      setMentor(parsedMentor);

      await loadRequests(
        parsedMentor._id,
        token
      );

    } catch (error) {
      console.error(
        "INITIALIZE MENTOR DASHBOARD ERROR:",
        error
      );

      setMessage(
        "Invalid mentor data."
      );

      setLoading(false);
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


  const loadRequests = async (
    mentorId,
    token
  ) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/mentor-request/mentor/${mentorId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "MENTOR DASHBOARD REQUEST RESPONSE:",
        data
      );


      /*
        JWT error
      */

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
            "Unable to load requests."
        );
        return;
      }


      /*
        Backend returns:

        [
          request1,
          request2,
          request3
        ]

        So data itself is the array.

        We also support { requests: [] }
        just in case the backend changes later.
      */

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (
        Array.isArray(data.requests)
      ) {
        setRequests(data.requests);
      } else {
        setRequests([]);
      }

    } catch (error) {
      console.error(
        "LOAD MENTOR REQUESTS ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };


  const updateRequest = async (
    requestId,
    status
  ) => {

    const token =
      localStorage.getItem("skillsyncToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setUpdatingId(requestId);
    setMessage("");

    try {

      const response = await fetch(
        `${API_URL}/api/mentor-request/${requestId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "UPDATE MENTOR REQUEST RESPONSE:",
        data
      );


      /*
        JWT error
      */

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
            "Failed to update request."
        );
        return;
      }


      setMessage(
        `Request ${status.toLowerCase()} successfully.`
      );


      /*
        Reload requests after update
      */

      if (mentor) {
        await loadRequests(
          mentor._id,
          token
        );
      }

    } catch (error) {

      console.error(
        "UPDATE MENTOR REQUEST ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );

    } finally {
      setUpdatingId(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading mentor dashboard...
        </p>
      </div>
    );
  }


  const pendingRequests =
    requests.filter(
      (request) =>
        request.status === "Pending"
    ).length;


  const acceptedRequests =
    requests.filter(
      (request) =>
        request.status === "Accepted"
    ).length;


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Mentor Dashboard
              </h1>

              {mentor && (
                <p className="text-gray-600 mt-2">
                  Welcome, {mentor.name}
                </p>
              )}

            </div>

            {mentor && (
              <div className="text-5xl">
                {mentor.icon}
              </div>
            )}

          </div>

        </div>


        {/* Message */}

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}


        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div className="bg-white rounded-xl shadow-md p-6">

            <p className="text-gray-500">
              Total Requests
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {requests.length}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-md p-6">

            <p className="text-gray-500">
              Pending Requests
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingRequests}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-md p-6">

            <p className="text-gray-500">
              Accepted Requests
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {acceptedRequests}
            </p>

          </div>

        </div>


        {/* Mentor Information */}

        {mentor && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold text-gray-800">
              Mentor Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

              <div>

                <p className="text-gray-500 text-sm">
                  Skill
                </p>

                <p className="font-semibold text-gray-800">
                  {mentor.skill}
                </p>

              </div>


              <div>

                <p className="text-gray-500 text-sm">
                  Expertise
                </p>

                <p className="font-semibold text-gray-800">
                  {mentor.expertise}
                </p>

              </div>


              <div>

                <p className="text-gray-500 text-sm">
                  Experience
                </p>

                <p className="font-semibold text-gray-800">
                  {mentor.experience}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* Requests */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Learner Requests
          </h2>


          {requests.length === 0 && (
            <div className="text-center py-10">

              <p className="text-gray-500">
                No learner requests yet.
              </p>

            </div>
          )}


          <div className="space-y-5">

            {requests.map((request) => {

              const learner =
                request.learnerId;

              return (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-xl p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold text-gray-800">
                        {learner?.name ||
                          "Learner"}
                      </h3>

                      <p className="text-gray-500">
                        {learner?.email || ""}
                      </p>

                    </div>


                    {/* Status */}

                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        request.status ===
                        "Accepted"
                          ? "bg-green-100 text-green-700"
                          : request.status ===
                            "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.status}
                    </span>

                  </div>


                  {/* Request Details */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-sm text-gray-500">
                        Skill
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {request.skill}
                      </p>

                    </div>


                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-sm text-gray-500">
                        Level
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {request.level}
                      </p>

                    </div>


                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-sm text-gray-500">
                        Score
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {request.score}
                      </p>

                    </div>

                  </div>


                  {/* Accept / Reject */}

                  {request.status ===
                    "Pending" && (

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() =>
                          updateRequest(
                            request._id,
                            "Accepted"
                          )
                        }
                        disabled={
                          updatingId ===
                          request._id
                        }
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {updatingId ===
                        request._id
                          ? "Updating..."
                          : "Accept"}
                      </button>


                      <button
                        onClick={() =>
                          updateRequest(
                            request._id,
                            "Rejected"
                          )
                        }
                        disabled={
                          updatingId ===
                          request._id
                        }
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {updatingId ===
                        request._id
                          ? "Updating..."
                          : "Reject"}
                      </button>

                    </div>

                  )}


                  {/* Request Date */}

                  <p className="text-sm text-gray-400 mt-4">
                    Request sent:{" "}
                    {new Date(
                      request.createdAt
                    ).toLocaleString()}
                  </p>

                </div>
              );

            })}

          </div>

        </div>


        {/* Navigation */}

        <div className="flex justify-center gap-6 mt-8">

          <button
            onClick={() =>
              router.push("/mentors")
            }
            className="text-blue-600 hover:underline"
          >
            ← Find Mentors
          </button>

          <button
            onClick={() =>
              router.push("/mentor-request")
            }
            className="text-blue-600 hover:underline"
          >
            View My Requests
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