const mongoose = require("mongoose");
const UserModel = require("./auth/UserModel");

const SkillsTrackSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  basicQuestion: {
    type: [String],
    required: true,
    default: [],
  },
  checkedBasicQuestions: { type: [Boolean], default: [] },

  mediumQuestion: {
    type: [String],
    required: true,
    default: [],
  },
  checkedMediumQuestions: { type: [Boolean], default: [] },

  hardQuestion: {
    type: [String],
    required: true,
    default: [],
  },
  checkedHardQuestions: { type: [Boolean], default: [] },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },

  roadmap: [
    {
      question: String,
      answer: String,
      marks: Number,
    },
  ],
  checkedRoadmap: { type: [Boolean], default: [] },
  score: { type: Number, default: 0 },

  practicalWork: {
    type: [String],
    required: true,
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  }
});

module.exports = mongoose.model("SkillsTrack", SkillsTrackSchema);
