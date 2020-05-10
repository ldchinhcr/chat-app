const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Chatroom is required!"],
    ref: "Chatroom",
  },
  isCoords: {
    type: Boolean,
    default: false
  },
  isUrl: {
    type: Boolean,
    default: false
  },
  isImg: {
    type: Boolean,
    default: false
  },
  isYTube: {
    type: Boolean,
    default: false
  },
  username: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required!"],
      ref: "User",
    },
  name: {
      type: String
    },
  avatarColor: {
    type: String
  }
  },
  message: {
    type: String,
    required: [true, "Message is required!"],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);
