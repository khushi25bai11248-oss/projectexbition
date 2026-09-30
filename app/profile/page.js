"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [level, setLevel] = useState("Beginner");

  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* =====================================================
     CHECK LOGIN + LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    const token = localStorage.getItem("skillsyncToken");
    const savedUser = localStorage.getItem("skillsyncUser");

    if (!token || !savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const userData = JSON.parse(savedUser);

      if (!userData.id) {
        localStorage.removeItem("skillsyncToken");
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncLoggedIn");

        router.replace("/login");
        return;
      }

      setUser(userData);

      loadProfile(userData.id, token);
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("skillsyncToken");
      localStorage.removeItem("skillsyncUser");
      localStorage.removeItem("skillsyncLoggedIn");

      router.replace("/login");
    }
  }, [router]);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  const loadProfile = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/profile/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load profile"
        );
        return;
      }

      setTeachSkills(data.teachSkills || []);
      setLearnSkills(data.learnSkills || []);
      setLevel(data.level || "Beginner");
    } catch (error) {
      console.error("Load profile error:", error);

      setMessage(
        "Cannot connect to backend. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     ADD TEACH SKILL
  ===================================================== */

  const addTeachSkill = () => {
    const skill = teachInput.trim();

    if (!skill) return;

    if (
      !teachSkills.some(
        (item) =>
          item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setTeachSkills([...teachSkills, skill]);
    }

    setTeachInput("");
  };

  /* =====================================================
     ADD LEARN SKILL
  ===================================================== */

  const addLearnSkill = () => {
    const skill = learnInput.trim();

    if (!skill) return;

    if (
      !learnSkills.some(
        (item) =>
          item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setLearnSkills([...learnSkills, skill]);
    }

    setLearnInput("");
  };

  /* =====================================================
     REMOVE TEACH SKILL
  ===================================================== */

  const removeTeachSkill = (skillToRemove) => {
    setTeachSkills(
      teachSkills.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  /* =====================================================
     REMOVE LEARN SKILL
  ===================================================== */

  const removeLearnSkill = (skillToRemove) => {
    setLearnSkills(
      learnSkills.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const saveProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("skillsyncToken");

    if (!token || !user?.id) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            teachSkills,
            learnSkills,
            level,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to save profile"
        );
        return;
      }

      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error("Save profile error:", error);

      setMessage(
        "Cannot connect to backend. Make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem("skillsyncUser");
    localStorage.removeItem("skillsyncToken");
    localStorage.removeItem("skillsyncLoggedIn");

    router.replace("/login");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold">
                My Profile
              </h1>

              {user && (
                <p className="text-gray-600 mt-1">
                  {user.name} • {user.email}
                </p>
              )}
            </div>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>

        {/* PROFILE FORM */}

        <form
          onSubmit={saveProfile}
          className="bg-white rounded-xl shadow-md p-6 space-y-6"
        >

          {/* LEVEL */}

          <div>
            <label className="block font-semibold mb-2">
              Current Skill Level
            </label>

            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value)
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          {/* TEACH SKILLS */}

          <div>

            <label className="block font-semibold mb-2">
              Skills I Can Teach
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={teachInput}
                onChange={(e) =>
                  setTeachInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTeachSkill();
                  }
                }}
                placeholder="Example: JavaScript"
                className="flex-1 p-3 border rounded-lg"
              />

              <button
                type="button"
                onClick={addTeachSkill}
                className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-3">

              {teachSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                >
                  <span>{skill}</span>

                  <button
                    type="button"
                    onClick={() =>
                      removeTeachSkill(skill)
                    }
                    className="font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>

          </div>

          {/* LEARN SKILLS */}

          <div>

            <label className="block font-semibold mb-2">
              Skills I Want to Learn
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={learnInput}
                onChange={(e) =>
                  setLearnInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLearnSkill();
                  }
                }}
                placeholder="Example: Python"
                className="flex-1 p-3 border rounded-lg"
              />

              <button
                type="button"
                onClick={addLearnSkill}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700"
              >
                Add
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-3">

              {learnSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full"
                >
                  <span>{skill}</span>

                  <button
                    type="button"
                    onClick={() =>
                      removeLearnSkill(skill)
                    }
                    className="font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

          {/* MESSAGE */}

          {message && (
            <p className="text-center text-blue-600 font-medium">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}