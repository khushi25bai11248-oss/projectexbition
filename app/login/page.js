"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // =============================
      // GET USER ID
      // =============================

      const userId =
        data.user?.id || data.user?._id;

      if (!userId) {
        console.error(
          "No user ID received:",
          data
        );

        setMessage(
          "Login failed: User ID not received from backend."
        );

        return;
      }

      // =============================
      // GET JWT TOKEN
      // =============================

      const token = data.token;

      if (!token) {
        console.error(
          "No JWT token received:",
          data
        );

        setMessage(
          "Login failed: Authentication token not received."
        );

        return;
      }

      // =============================
      // CLEAR OLD LOGIN DATA
      // =============================

      localStorage.removeItem("skillsyncUser");
      localStorage.removeItem("skillsyncLoggedIn");
      localStorage.removeItem("skillsyncToken");

      // =============================
      // SAVE USER
      // =============================

      const userData = {
        id: userId.toString(),
        name: data.user.name,
        email: data.user.email,
      };

      localStorage.setItem(
        "skillsyncUser",
        JSON.stringify(userData)
      );

      // =============================
      // SAVE JWT TOKEN
      // =============================

      localStorage.setItem(
        "skillsyncToken",
        token
      );

      // Keep this temporarily for compatibility
      localStorage.setItem(
        "skillsyncLoggedIn",
        "true"
      );

      console.log(
        "SAVED USER:",
        userData
      );

      console.log(
        "JWT TOKEN SAVED"
      );

      setMessage("Login successful!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setMessage(
        "Cannot connect to backend. Make sure the backend is running."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="text-center mt-4 text-blue-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}