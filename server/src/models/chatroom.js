const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  chatroom: {
    type: String,
    required: "Name is required!",
    trim: true,
    unique: true
  },
  username: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model("Chatroom", chatroomSchema);