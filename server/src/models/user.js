const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      unique: true
    },
    sid: {
      type: String
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom'
    },
    active: {
      type: Boolean,
      default: true
    },
    avatarColor: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);