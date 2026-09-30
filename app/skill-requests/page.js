"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000";

export default function SkillRequests() {
  const [user, setUser] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("skillsyncUser");
    const token = localStorage.getItem("skillsyncToken");

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
      loadRequests(parsedUser.id, token);
    } catch (error) {
      console.error(error);

      localStorage.removeItem("skillsyncUser");
      localStorage.removeItem("skillsyncToken");

      window.location.href = "/login";
    }
  }, []);

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  const loadRequests = async (userId, token) => {
    try {
      setLoading(true);
      setMessage("");

      const [receivedResponse, sentResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/skill-exchange/requests/received/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_URL}/api/skill-exchange/requests/sent/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const receivedData =
        await receivedResponse.json();

      const sentData =
        await sentResponse.json();

      // ==========================================
      // AUTHENTICATION ERROR
      // ==========================================

      if (
        receivedResponse.status === 401 ||
        receivedResponse.status === 403 ||
        sentResponse.status === 401 ||
        sentResponse.status === 403
      ) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");

        window.location.href = "/login";
        return;
      }

      // ==========================================
      // RECEIVED ERROR
      // ==========================================

      if (!receivedResponse.ok) {
        setMessage(
          receivedData.message ||
            "Unable to load received requests."
        );
        return;
      }

      // ==========================================
      // SENT ERROR
      // ==========================================

      if (!sentResponse.ok) {
        setMessage(
          sentData.message ||
            "Unable to load sent requests."
        );
        return;
      }

      // Backend returns direct arrays
      setReceivedRequests(
        Array.isArray(receivedData)
          ? receivedData
          : receivedData.requests || []
      );

      setSentRequests(
        Array.isArray(sentData)
          ? sentData
          : sentData.requests || []
      );
    } catch (error) {
      console.error(
        "REQUEST LOAD ERROR:",
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
  // ACCEPT / REJECT REQUEST
  // ==========================================

  const updateRequest = async (
    requestId,
    status
  ) => {
    const token =
      localStorage.getItem("skillsyncToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setUpdatingId(requestId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/skill-exchange/${requestId}`,
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

      const data = await response.json();

      // ==========================================
      // AUTHENTICATION ERROR
      // ==========================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");

        window.location.href = "/login";
        return;
      }

      // ==========================================
      // OTHER ERROR
      // ==========================================

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update request."
        );
        return;
      }

      setMessage(
        `Request ${status.toLowerCase()} successfully.`
      );

      // Reload requests
      if (user?.id) {
        const newToken =
          localStorage.getItem("skillsyncToken");

        await loadRequests(
          user.id,
          newToken
        );
      }
    } catch (error) {
      console.error(
        "UPDATE REQUEST ERROR:",
        error
      );

      setMessage(
        "Cannot connect to backend."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading skill requests...
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
            Skill Exchange Requests
          </h1>

          {user && (
            <p className="text-gray-600 mt-2">
              Welcome, {user.name}
            </p>
          )}

          <p className="text-gray-500 mt-2">
            Manage the skill exchange requests
            you have received and sent.
          </p>

          {/* MESSAGE */}

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mt-4">
              {message}
            </div>
          )}

        </div>

        {/* ==========================================
            RECEIVED REQUESTS
        ========================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Received Requests
          </h2>

          {receivedRequests.length === 0 ? (
            <p className="text-gray-500">
              No received requests.
            </p>
          ) : (
            <div className="space-y-4">

              {receivedRequests.map(
                (request) => (

                  <div
                    key={request._id}
                    className="border rounded-lg p-5"
                  >

                    {/* SENDER */}

                    <h3 className="text-xl font-semibold text-gray-800">
                      {request.senderId?.name ||
                        "Unknown User"}
                    </h3>

                    <p className="text-gray-500">
                      {request.senderId?.email ||
                        ""}
                    </p>

                    {/* SKILLS */}

                    <div className="mt-4">

                      <p className="text-gray-700">
                        <strong>
                          They will teach:
                        </strong>{" "}
                        {request.skillToTeach}
                      </p>

                      <p className="text-gray-700 mt-1">
                        <strong>
                          They want to learn:
                        </strong>{" "}
                        {request.skillToLearn}
                      </p>

                    </div>

                    {/* STATUS */}

                    <p className="mt-3">

                      <strong>
                        Status:
                      </strong>{" "}

                      <span
                        className={
                          request.status ===
                          "Pending"
                            ? "text-yellow-600"
                            : request.status ===
                              "Accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {request.status}
                      </span>

                    </p>

                    {/* ACTION BUTTONS */}

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
                          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {updatingId ===
                          request._id
                            ? "Updating..."
                            : "Reject"}
                        </button>

                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ==========================================
            SENT REQUESTS
        ========================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Sent Requests
          </h2>

          {sentRequests.length === 0 ? (
            <p className="text-gray-500">
              No sent requests.
            </p>
          ) : (
            <div className="space-y-4">

              {sentRequests.map(
                (request) => (

                  <div
                    key={request._id}
                    className="border rounded-lg p-5"
                  >

                    {/* RECEIVER */}

                    <h3 className="text-xl font-semibold text-gray-800">
                      {request.receiverId?.name ||
                        "Unknown User"}
                    </h3>

                    <p className="text-gray-500">
                      {request.receiverId?.email ||
                        ""}
                    </p>

                    {/* SKILLS */}

                    <div className="mt-4">

                      <p className="text-gray-700">
                        <strong>
                          You will teach:
                        </strong>{" "}
                        {request.skillToTeach}
                      </p>

                      <p className="text-gray-700 mt-1">
                        <strong>
                          You will learn:
                        </strong>{" "}
                        {request.skillToLearn}
                      </p>

                    </div>

                    {/* STATUS */}

                    <p className="mt-3">

                      <strong>
                        Status:
                      </strong>{" "}

                      <span
                        className={
                          request.status ===
                          "Pending"
                            ? "text-yellow-600"
                            : request.status ===
                              "Accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {request.status}
                      </span>

                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* LINKS */}

        <div className="flex justify-center gap-6">

          <Link
            href="/skill-exchange"
            className="text-blue-600 hover:underline"
          >
            ← Skill Exchange
          </Link>

          <Link
            href="/profile"
            className="text-blue-600 hover:underline"
          >
            Profile
          </Link>

        </div>

      </div>

    </div>
  );
}