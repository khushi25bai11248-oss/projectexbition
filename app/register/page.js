// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   function handleRegister(e) {
//     e.preventDefault();

//     // Check all fields
//     if (!name || !email || !password || !confirmPassword) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     // Check email
//     if (!email.includes("@")) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     // Check password length
//     if (password.length < 6) {
//       alert("Password must contain at least 6 characters.");
//       return;
//     }

//     // Check passwords
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     // Save user information temporarily
//     const user = {
//       name: name,
//       email: email,
//       password: password,
//     };

//     localStorage.setItem("skillsyncUser", JSON.stringify(user));

//     alert("Account created successfully!");

//     window.location.href = "/login";
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 px-6 py-16">

//       <div className="mx-auto max-w-xl">

//         {/* Heading */}
//         <div className="mb-8 text-center">

//           <Link
//             href="/"
//             className="text-2xl font-bold text-blue-600"
//           >
//             SkillSync
//           </Link>

//           <h1 className="mt-8 text-4xl font-bold text-slate-900">
//             Create your account
//           </h1>

//           <p className="mt-3 text-lg text-slate-600">
//             Start learning, sharing and growing with SkillSync.
//           </p>

//         </div>

//         {/* Register Card */}
//         <div className="rounded-3xl bg-white p-8 shadow-lg md:p-12">

//           <form onSubmit={handleRegister} className="space-y-6">

//             {/* Name */}
//             <div>
//               <label className="mb-2 block font-semibold text-slate-700">
//                 Full Name
//               </label>

//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="mb-2 block font-semibold text-slate-700">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="mb-2 block font-semibold text-slate-700">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 placeholder="Create a password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="mb-2 block font-semibold text-slate-700">
//                 Confirm Password
//               </label>

//               <input
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700"
//             >
//               Create Account
//             </button>

//           </form>

//           {/* Login Link */}
//           <p className="mt-8 text-center text-slate-600">

//             Already have an account?{" "}

//             <Link
//               href="/login"
//               className="font-semibold text-blue-600 hover:underline"
//             >
//               Login
//             </Link>

//           </p>

//         </div>

//       </div>

//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // Keep basic user information locally for the current frontend
      localStorage.setItem("skillsyncUser", JSON.stringify({
        name: data.user.name,
        email: data.user.email
      }));

      setMessage("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (error) {
      setMessage("Cannot connect to backend. Make sure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create SkillSync Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Register
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