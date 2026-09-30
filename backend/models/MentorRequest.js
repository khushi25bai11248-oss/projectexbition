const mongoose = require("mongoose");

const mentorRequestSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true
    },

    skill: {
      type: String,
      required: true
    },

    level: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "MentorRequest",
  mentorRequestSchema
);