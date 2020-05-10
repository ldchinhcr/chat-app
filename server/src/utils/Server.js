const User = require("../models/user");
const ChatRoom = require("../models/chatroom");
const Message = require('../models/message');


class Server {
  constructor(user) {
    this.sys = "System"
    this.user = user;
  };
  
    static async loginUser (sid, obj) {
      let name = obj.username.trim();
      let user = await User.findOne({ name:  {$regex: new RegExp(`^${name}$`, 'i')}});
      if (!user) {
        user = await User.create({ name, chatroom: obj.chatroom, sid: sid, avatarColor: obj.avatarColor});
      };
      user.sid = sid;
      user.active = true;
      user.chatroom = obj.chatroom;
      await user.save();
      return new Server(user)
    };

    static async checkUser(socketId) {
      let user = await User.findOne({ sid: socketId });
      if (!user) throw new Error("User not found");
      return new Server(user)
    };

    async joinRoom(rID) {
      const room = await ChatRoom.findById(rID);
      if (!room) {
        throw new Error("Room not found");
      };
      if (!room.username.includes(this.user._id)) {
        room.username.push(this.user._id);
        await room.save();
      };
      this.user.chatroom = rID;
      await this.user.save();
      this.user.chatroom = room;
    };

    static async createRoom(room) {
        const nameRoom = room.trim();
        const chatroom = await ChatRoom.findOne({chatroom: {$regex: new RegExp(`^${nameRoom}$`, 'i')} });
        if (!chatroom) {
          const newRoom = await ChatRoom.create({ chatroom: nameRoom });
          return newRoom;
        }
        throw new Error(`${room} Room already exist! Please try with another name.`)
    }

    static async allRoom() {
      const chatroom = await ChatRoom.find().select('-__v');
      return chatroom;
    }

    static async readMessages(rId) {
      const messages = await Message.find({chatroom: rId})
      return messages;
    }

    sendWelcomeMessage() {
    return {
      _id: new Date(),
      chat: `Welcome ${this.user.name} to ${this.user.chatroom.chatroom}`,
      user: { id: null, name: this.sys },
      createdAt: new Date().getTime()
    };
    };

    sendNewUserJoinNotification() {
      return {
        _id: new Date(),
        chat: `${this.user.name} has joined the chat`,
        user: { id: null, name: this.sys },
        createdAt: new Date().getTime()
      }
    }

    sendUserLeaveMessage() {
      return {
        _id: new Date(),
        chat: `${this.user.name} has left the chat`,
        user: { id: null, name: this.sys },
        createdAt: new Date().getTime()
      }
    }

    sendProfanityNotification() {
      return {
        _id: new Date(),
        chat: 'Profanity is not allowed!',
        user: { id: null, name: this.sys },
        createdAt: new Date().getTime()
      }
    }

    sendOldMessage(chat) {
      return {
        _id: new Date(),
        chat: chat,
        user: { id: this.user._id, name: this.user.name, avatarColor: this.user.avatarColor},
        createdAt: new Date().getTime()
      }
    }

    sendMessage(chat) {
      return {
        _id: new Date(),
        chat: chat.message,
        user: { id: this.user._id, name: this.user.name, avatarColor: this.user.avatarColor },
        isUrl: chat.isUrl,
        isCoords: chat.isCoords,
        isImg: chat.isImg,
        isYTube: chat.isYTube,
        createdAt: new Date().getTime()
      }
    }

    async leaveRoom() {
      const room = await ChatRoom.findById(this.user.chatroom._id);
      if (!room) {
        throw new Error("Room not found")
      };
      room.username.remove(this.user._id)
      await room.save()
    }

    async userLogout() {
      const room = await ChatRoom.findById(this.user.chatroom._id);
      room.username.remove(this.user._id)
      await room.save()
    }

    async userOutRoom(socketId) {
      let user = await User.findOne({ sid: socketId });
      if (!user) throw new Error("User not found");
      user.sid = null;
      user.active = false;
      user.chatroom = null;
      await user.save();
    }

    async chat(obj) {
      const chat = await Message.create({
        message: obj,
        username: {
          id: this.user._id,
          name: this.user.name,
          avatarColor: this.user.avatarColor
        },
        chatroom: this.user.chatroom._id
      });
      return chat
    }

    async location(text) {
      const chat = await Message.create({
        message: text,
        isCoords: true,
        username: {
          id: this.user._id,
          name: this.user.name,
          avatarColor: this.user.avatarColor
        },
        chatroom: this.user.chatroom._id
      });
      return chat
    }

    async generateURLMsg(text) {
      const chat = await Message.create({
        message: text,
        isUrl: true,
        username: {
          id: this.user._id,
          name: this.user.name,
          avatarColor: this.user.avatarColor
        },
        chatroom: this.user.chatroom._id
      });
      return chat
    }

    async generateImgChat(text) {
      const chat = await Message.create({
        message: text,
        isImg: true,
        username: {
          id: this.user._id,
          name: this.user.name,
          avatarColor: this.user.avatarColor
        },
        chatroom: this.user.chatroom._id
      });
      return chat
    }

    async generateYTube(text) {
      const chat = await Message.create({
        message: text,
        isYTube: true,
        username: {
          id: this.user._id,
          name: this.user.name,
          avatarColor: this.user.avatarColor
        },
        chatroom: this.user.chatroom._id
      });
      return chat
    }

}

module.exports = Server;