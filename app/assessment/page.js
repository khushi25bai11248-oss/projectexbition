"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "What is a variable used for in programming?",
    options: [
      "Store data",
      "Create a webpage",
      "Style a webpage",
      "Connect to the internet",
    ],
    answer: "Store data",
  },
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: [
      "var",
      "let",
      "const",
      "constant",
    ],
    answer: "const",
  },
  {
    question: "What does HTML provide?",
    options: [
      "Web page structure",
      "Database management",
      "Server hosting",
      "Image editing",
    ],
    answer: "Web page structure",
  },
  {
    question: "What is CSS mainly used for?",
    options: [
      "Programming logic",
      "Styling web pages",
      "Creating databases",
      "Managing servers",
    ],
    answer: "Styling web pages",
  },
  {
    question: "What is a function?",
    options: [
      "A reusable block of code",
      "A database",
      "A web browser",
      "A programming language",
    ],
    answer: "A reusable block of code",
  },
];

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [skill, setSkill] = useState("Web Development");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const savedUser = localStorage.getItem("skillsyncUser");
        const token = localStorage.getItem("skillsyncToken");

        if (!savedUser || !token) {
          window.location.href = "/login";
          return;
        }

        JSON.parse(savedUser);

        const selectedSkill =
          localStorage.getItem("skillsyncSelectedSkill");

        if (selectedSkill) {
          setSkill(selectedSkill);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);

        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");
        localStorage.removeItem("skillsyncLoggedIn");

        window.location.href = "/login";
      }
    };

    checkAuthentication();
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError("Please select an answer before continuing.");
      return;
    }

    setError("");

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selectedAnswer;

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(
        updatedAnswers[currentQuestion + 1] || ""
      );
      return;
    }

    await submitAssessment(updatedAnswers);
  };

  const submitAssessment = async (finalAnswers) => {
    try {
      setSubmitting(true);

      const savedUser = localStorage.getItem("skillsyncUser");
      const token = localStorage.getItem("skillsyncToken");

      if (!savedUser || !token) {
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(savedUser);

      if (!user.id) {
        window.location.href = "/login";
        return;
      }

      // Calculate score
      let correctAnswers = 0;

      finalAnswers.forEach((answer, index) => {
        if (answer === questions[index].answer) {
          correctAnswers++;
        }
      });

      const score = Math.round(
        (correctAnswers / questions.length) * 100
      );

      // Determine level
      let level = "Beginner";

      if (score >= 80) {
        level = "Advanced";
      } else if (score >= 50) {
        level = "Intermediate";
      }

      // Save assessment in backend
      const response = await fetch(
        "http://127.0.0.1:5000/api/assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            skill: skill,
            score: score,
            level: level,
          }),
        }
      );

      const data = await response.json();

      // JWT expired or invalid
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("skillsyncUser");
        localStorage.removeItem("skillsyncToken");
        localStorage.removeItem("skillsyncLoggedIn");
        localStorage.removeItem("skillsyncAssessment");

        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setError(
          data.message || "Unable to save assessment."
        );
        setSubmitting(false);
        return;
      }

      // Save assessment locally too
      const assessmentResult = {
        skill: skill,
        score: score,
        level: level,
      };

      localStorage.setItem(
        "skillsyncAssessment",
        JSON.stringify(assessmentResult)
      );

      // Go to personalized resources
      window.location.href = "/resources";

    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to backend. Make sure the backend is running."
      );

      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading assessment...
        </p>
      </main>
    );
  }

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="text-2xl font-bold text-blue-600"
          >
            SkillSync
          </button>

          <span className="text-sm font-semibold text-slate-500">
            Skill Assessment
          </span>

        </div>
      </nav>

      {/* Main Content */}
      <section className="mx-auto max-w-3xl px-6 py-12">

        {/* Header */}
        <div className="text-center">

          <p className="font-semibold text-blue-600">
            SkillSync Assessment
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Test Your {skill} Skills
          </h1>

          <p className="mt-4 text-slate-600">
            Answer the following questions to determine your current
            skill level.
          </p>

        </div>

        {/* Progress */}
        <div className="mt-10">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-semibold text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question Card */}
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            {question.question}
          </h2>

          <div className="mt-8 space-y-4">

            {question.options.map((option, index) => {

              const isSelected =
                selectedAnswer === option;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full rounded-xl border p-5 text-left transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span className="font-medium">
                      {option}
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

          {/* Error */}
          {error && (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {/* Next / Finish */}
          <button
            onClick={handleNext}
            disabled={submitting}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Saving Assessment..."
              : currentQuestion === questions.length - 1
              ? "Finish Assessment"
              : "Next Question →"}
          </button>

        </div>

        {/* Information */}
        <div className="mt-6 text-center">

          <p className="text-sm text-slate-500">
            Your result will be used to personalize your learning
            resources and mentor recommendations.
          </p>

        </div>

      </section>

    </main>
  );
}