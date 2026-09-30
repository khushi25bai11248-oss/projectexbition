const mongoose = require("mongoose");

const skillExchangeSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skillToTeach: {
      type: String,
      required: true
    },

    skillToLearn: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SkillExchange",
  skillExchangeSchema
);