const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Profile = require("./models/Profile");
const SkillExchange = require("./models/SkillExchange");
const Mentor = require("./models/Mentor");
const MentorRequest = require("./models/MentorRequest");
const Assessment = require("./models/Assessment");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

/* =========================================================
   DATABASE CONNECTION
========================================================= */

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected to database: skillsyncTest");
    seedMentors();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

/* =========================================================
   JWT AUTHENTICATION
========================================================= */

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

/* =========================================================
   USER ID SECURITY
========================================================= */

function verifyUserId(req, res, next) {
  const requestedUserId = req.params.userId;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (requestedUserId !== req.user.id.toString()) {
    return res.status(403).json({
      message: "You cannot access another user's data",
    });
  }

  next();
}

/* =========================================================
   BASIC ROUTES
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "SkillSync backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SkillSync backend is healthy",
  });
});

/* =========================================================
   REGISTER
========================================================= */

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

/* =========================================================
   VERIFY JWT
========================================================= */

app.get(
  "/api/auth/verify",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select(
        "-password"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Token is valid",
        user,
      });
    } catch (error) {
      console.error("Token verification error:", error);

      res.status(500).json({
        message: "Token verification failed",
      });
    }
  }
);

/* =========================================================
   PROFILE
========================================================= */

/* GET PROFILE */

app.get(
  "/api/profile/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        userId: req.params.userId,
      });

      if (!profile) {
        return res.json({
          userId: req.params.userId,
          teachSkills: [],
          learnSkills: [],
          level: "Beginner",
        });
      }

      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);

      res.status(500).json({
        message: "Error fetching profile",
        error: error.message,
      });
    }
  }
);

/* CREATE / UPDATE PROFILE */

app.post(
  "/api/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        userId,
        teachSkills,
        learnSkills,
        level,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      if (userId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "You cannot modify another user's profile",
        });
      }

      const profile = await Profile.findOneAndUpdate(
        { userId },
        {
          userId,
          teachSkills: teachSkills || [],
          learnSkills: learnSkills || [],
          level: level || "Beginner",
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.json({
        message: "Profile saved successfully",
        profile,
      });
    } catch (error) {
      console.error("Save profile error:", error);

      res.status(500).json({
        message: "Error saving profile",
        error: error.message,
      });
    }
  }
);

/* UPDATE PROFILE */

app.put(
  "/api/profile/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const {
        teachSkills,
        learnSkills,
        level,
      } = req.body;

      const profile = await Profile.findOneAndUpdate(
        { userId: req.params.userId },
        {
          teachSkills: teachSkills || [],
          learnSkills: learnSkills || [],
          level: level || "Beginner",
        },
        {
          new: true,
        }
      );

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      res.json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      res.status(500).json({
        message: "Error updating profile",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   ASSESSMENT
========================================================= */

/* IMPORTANT:
   This route MUST come before /api/assessment/:userId/:skill
*/

app.get(
  "/api/assessment/user/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const assessments = await Assessment.find({
        userId: req.params.userId,
      }).sort({
        createdAt: -1,
      });

      res.json(assessments);
    } catch (error) {
      console.error("Get user assessments error:", error);

      res.status(500).json({
        message: "Error fetching assessments",
        error: error.message,
      });
    }
  }
);

/* SAVE ASSESSMENT */

app.post(
  "/api/assessment",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        userId,
        skill,
        score,
        level,
      } = req.body;

      if (!userId || !skill || score === undefined || !level) {
        return res.status(400).json({
          message: "All assessment fields are required",
        });
      }

      if (userId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "You cannot save another user's assessment",
        });
      }

      const assessment = await Assessment.create({
        userId,
        skill,
        score,
        level,
      });

      /* Also update profile level */

      await Profile.findOneAndUpdate(
        { userId },
        {
          userId,
          level,
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.status(201).json({
        message: "Assessment saved successfully",
        assessment,
      });
    } catch (error) {
      console.error("Save assessment error:", error);

      res.status(500).json({
        message: "Error saving assessment",
        error: error.message,
      });
    }
  }
);

/* GET ASSESSMENT FOR USER + SKILL */

app.get(
  "/api/assessment/:userId/:skill",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const assessment = await Assessment.findOne({
        userId: req.params.userId,
        skill: req.params.skill,
      }).sort({
        createdAt: -1,
      });

      if (!assessment) {
        return res.status(404).json({
          message: "Assessment not found",
        });
      }

      res.json(assessment);
    } catch (error) {
      console.error("Get assessment error:", error);

      res.status(500).json({
        message: "Error fetching assessment",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   SKILL EXCHANGE
========================================================= */

/* GET ALL MATCHES */

app.get(
  "/api/skill-exchange/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const userProfile = await Profile.findOne({
        userId: req.params.userId,
      });

      if (!userProfile) {
        return res.json([]);
      }

      const otherProfiles = await Profile.find({
        userId: {
          $ne: req.params.userId,
        },
      }).populate("userId", "name email");

      const matches = [];

      for (const profile of otherProfiles) {
        const teachSkills = profile.teachSkills || [];
        const learnSkills = profile.learnSkills || [];

        const currentUserTeach =
          userProfile.teachSkills || [];

        const currentUserLearn =
          userProfile.learnSkills || [];

        const canTeachUser = currentUserTeach.some(
          (skill) => learnSkills.includes(skill)
        );

        const canLearnFromUser = currentUserLearn.some(
          (skill) => teachSkills.includes(skill)
        );

        if (canTeachUser && canLearnFromUser) {
          matches.push({
            userId: profile.userId._id,
            name: profile.userId.name,
            email: profile.userId.email,
            teachSkills: profile.teachSkills,
            learnSkills: profile.learnSkills,
            level: profile.level,
          });
        }
      }

      res.json(matches);
    } catch (error) {
      console.error("Skill exchange matching error:", error);

      res.status(500).json({
        message: "Error finding skill matches",
        error: error.message,
      });
    }
  }
);

/* CREATE SKILL EXCHANGE REQUEST */

app.post(
  "/api/skill-exchange/request",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        senderId,
        receiverId,
        skillToTeach,
        skillToLearn,
      } = req.body;

      if (
        !senderId ||
        !receiverId ||
        !skillToTeach ||
        !skillToLearn
      ) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      if (senderId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "You cannot send a request for another user",
        });
      }

      if (senderId.toString() === receiverId.toString()) {
        return res.status(400).json({
          message: "You cannot send a request to yourself",
        });
      }

      const existingRequest =
        await SkillExchange.findOne({
          senderId,
          receiverId,
          skillToTeach,
          skillToLearn,
          status: "Pending",
        });

      if (existingRequest) {
        return res.status(400).json({
          message: "Request already exists",
        });
      }

      const request = await SkillExchange.create({
        senderId,
        receiverId,
        skillToTeach,
        skillToLearn,
      });

      res.status(201).json({
        message: "Skill exchange request sent",
        request,
      });
    } catch (error) {
      console.error("Skill exchange request error:", error);

      res.status(500).json({
        message: "Error sending skill exchange request",
        error: error.message,
      });
    }
  }
);

/* RECEIVED REQUESTS */

app.get(
  "/api/skill-exchange/requests/received/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const requests = await SkillExchange.find({
        receiverId: req.params.userId,
      })
        .populate("senderId", "name email")
        .sort({
          createdAt: -1,
        });

      res.json(requests);
    } catch (error) {
      console.error(
        "Received skill exchange requests error:",
        error
      );

      res.status(500).json({
        message: "Error fetching received requests",
        error: error.message,
      });
    }
  }
);

/* SENT REQUESTS */

app.get(
  "/api/skill-exchange/requests/sent/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const requests = await SkillExchange.find({
        senderId: req.params.userId,
      })
        .populate("receiverId", "name email")
        .sort({
          createdAt: -1,
        });

      res.json(requests);
    } catch (error) {
      console.error(
        "Sent skill exchange requests error:",
        error
      );

      res.status(500).json({
        message: "Error fetching sent requests",
        error: error.message,
      });
    }
  }
);

/* UPDATE SKILL EXCHANGE REQUEST */

app.put(
  "/api/skill-exchange/:requestId",
  authenticateToken,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const request = await SkillExchange.findById(
        req.params.requestId
      );

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      if (
        request.receiverId.toString() !==
        req.user.id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only update requests sent to you",
        });
      }

      if (request.status !== "Pending") {
        return res.status(400).json({
          message: "Request has already been processed",
        });
      }

      request.status = status;

      await request.save();

      res.json({
        message: `Request ${status.toLowerCase()}`,
        request,
      });
    } catch (error) {
      console.error(
        "Update skill exchange request error:",
        error
      );

      res.status(500).json({
        message: "Error updating request",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   MENTORS
========================================================= */

/* GET ALL MENTORS */

app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({
      createdAt: 1,
    });

    res.json(mentors);
  } catch (error) {
    console.error("Get mentors error:", error);

    res.status(500).json({
      message: "Error fetching mentors",
      error: error.message,
    });
  }
});

/* =========================================================
   MENTOR REQUESTS
========================================================= */

/* CREATE MENTOR REQUEST */

app.post(
  "/api/mentor-request",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        learnerId,
        mentorId,
        skill,
        level,
        score,
      } = req.body;

      if (
        !learnerId ||
        !mentorId ||
        !skill ||
        !level ||
        score === undefined
      ) {
        return res.status(400).json({
          message: "All mentor request fields are required",
        });
      }

      if (
        learnerId.toString() !==
        req.user.id.toString()
      ) {
        return res.status(403).json({
          message:
            "You cannot create a mentor request for another user",
        });
      }

      const mentor = await Mentor.findById(mentorId);

      if (!mentor) {
        return res.status(404).json({
          message: "Mentor not found",
        });
      }

      const existingRequest =
        await MentorRequest.findOne({
          learnerId,
          mentorId,
          skill,
          status: "Pending",
        });

      if (existingRequest) {
        return res.status(400).json({
          message: "Mentor request already exists",
        });
      }

      const request = await MentorRequest.create({
        learnerId,
        mentorId,
        skill,
        level,
        score,
      });

      res.status(201).json({
        message: "Mentor request sent successfully",
        request,
      });
    } catch (error) {
      console.error("Create mentor request error:", error);

      res.status(500).json({
        message: "Error creating mentor request",
        error: error.message,
      });
    }
  }
);

/* LEARNER'S MENTOR REQUESTS */

app.get(
  "/api/mentor-request/learner/:userId",
  authenticateToken,
  verifyUserId,
  async (req, res) => {
    try {
      const requests = await MentorRequest.find({
        learnerId: req.params.userId,
      })
        .populate("mentorId")
        .sort({
          createdAt: -1,
        });

      res.json(requests);
    } catch (error) {
      console.error(
        "Get learner mentor requests error:",
        error
      );

      res.status(500).json({
        message: "Error fetching mentor requests",
        error: error.message,
      });
    }
  }
);

/* MENTOR REQUESTS */

app.get(
  "/api/mentor-request/mentor/:mentorId",
  authenticateToken,
  async (req, res) => {
    try {
      const requests = await MentorRequest.find({
        mentorId: req.params.mentorId,
      })
        .populate("learnerId", "name email")
        .populate("mentorId")
        .sort({
          createdAt: -1,
        });

      res.json(requests);
    } catch (error) {
      console.error(
        "Get mentor requests error:",
        error
      );

      res.status(500).json({
        message: "Error fetching mentor requests",
        error: error.message,
      });
    }
  }
);

/* UPDATE MENTOR REQUEST */

app.put(
  "/api/mentor-request/:requestId",
  authenticateToken,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const request = await MentorRequest.findById(
        req.params.requestId
      );

      if (!request) {
        return res.status(404).json({
          message: "Mentor request not found",
        });
      }

      /*
        Mentor records are demo mentor records,
        not authenticated mentor accounts.

        Therefore this route keeps the existing
        MentorRequest behavior while requiring
        authentication.
      */

      request.status = status;

      await request.save();

      res.json({
        message: `Mentor request ${status.toLowerCase()}`,
        request,
      });
    } catch (error) {
      console.error(
        "Update mentor request error:",
        error
      );

      res.status(500).json({
        message: "Error updating mentor request",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   SEED MENTORS
========================================================= */

async function seedMentors() {
  try {
    const count = await Mentor.countDocuments();

    if (count > 0) {
      console.log("Mentors already exist");
      return;
    }

    const mentors = [
      {
        name: "Aarav Sharma",
        skill: "Web Development",
        expertise: "JavaScript, React, Next.js",
        experience: "4+ years",
        icon: "💻",
        description:
          "Helps learners build modern web applications and understand frontend development.",
      },
      {
        name: "Diya Patel",
        skill: "Python",
        expertise: "Python, Django, Data Analysis",
        experience: "3+ years",
        icon: "🐍",
        description:
          "Guides beginners in Python programming, backend development and data analysis.",
      },
      {
        name: "Rohan Verma",
        skill: "Data Science",
        expertise: "Python, Machine Learning, Pandas",
        experience: "5+ years",
        icon: "📊",
        description:
          "Helps learners understand data science and machine learning concepts.",
      },
      {
        name: "Ananya Singh",
        skill: "UI/UX Design",
        expertise: "Figma, UI/UX Research",
        experience: "4+ years",
        icon: "🎨",
        description:
          "Teaches UI design, UX research and design thinking.",
      },
      {
        name: "Kabir Mehta",
        skill: "Web Development",
        expertise: "HTML, CSS, JavaScript",
        experience: "3+ years",
        icon: "🌐",
        description:
          "Helps beginners learn the fundamentals of web development.",
      },
      {
        name: "Meera Joshi",
        skill: "Python",
        expertise: "Python, Automation, APIs",
        experience: "4+ years",
        icon: "⚙️",
        description:
          "Guides learners through Python automation and API development.",
      },
    ];

    await Mentor.insertMany(mentors);

    console.log("Demo mentors created successfully");
  } catch (error) {
    console.error("Mentor seeding error:", error);
  }
}

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

