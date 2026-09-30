const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    teachSkills: {
      type: [String],
      default: []
    },

    learnSkills: {
      type: [String],
      default: []
    },

    level: {
      type: String,
      default: "Beginner"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Profile",
  profileSchema
);