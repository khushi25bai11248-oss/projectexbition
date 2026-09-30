const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    skill: {
      type: String,
      required: true
    },

    expertise: {
      type: String,
      required: true
    },

    experience: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      default: "👨‍🏫"
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Mentor", mentorSchema);