const http = require("http");
const app = require("./app");
const socketio = require("socket.io");
const Filter = require("bad-words");
const Server = require("./src/utils/Server");

const validator = require('validator');
const server = http.createServer(app);
const port = process.env.PORT || 4050;

const io = socketio(server);

io.on("connection", async (socket) => {
  console.log("Connection established");
  
  socket.on("fetchRoom", async (_, callback) => {
    try {
      socket.emit("allRoom", await Server.allRoom());
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("addRoom", async (chatroom, callback) => {
    try {
      const room = await Server.createRoom(chatroom.room);
      if (room) callback(`${room.chatroom} room has been created!`);
      socket.emit("allRoom", await Server.allRoom());
      callback();
    } catch (err) {
      callback(err.message);
    }
  });

  socket.on("join", async (obj, callback) => {
    try {
      const server = await Server.loginUser(
        socket.id,
        obj
      );
      await server.joinRoom(obj.chatroom);
      const messages = await Server.readMessages(server.user.chatroom._id);
      console.log(messages)
      socket.emit("selectedRoom", server.user.chatroom);
      socket.emit("allRoom", await Server.allRoom());
      socket.join(server.user.chatroom._id);
      socket.emit("messages", server.sendWelcomeMessage());
      socket.emit("setUser", server.user);
      io.to(server.user.chatroom._id).emit("oldmessages", messages);
      socket.broadcast
        .to(server.user.chatroom._id)
        .emit("messages", server.sendNewUserJoinNotification());
      callback();
    } catch (err) {
      callback({ ok: false, error: err.message });
    }
  });
  socket.on("sendInputMsg", async (obj, callback) => {
    try {
      const server = await Server.checkUser(socket.id);
      const filter = new Filter();
      if (filter.isProfane(obj.message)) {
        return callback({
          ok: true,
          data: server.sendProfanityNotification(),
        });
      }
      const newRegexImg = new RegExp(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i)
      const newRegexYT = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:&list=(\S+))?$/);
      if (newRegexYT.test(obj.message)) {
        const chat = await server.generateYTube(obj.message);
        io.to(server.user.chatroom._id).emit(
          "messages",
          server.sendMessage(chat)
        );
      } else if (newRegexImg.test(obj.message)) {
        const chat = await server.generateImgChat(obj.message);
        io.to(server.user.chatroom._id).emit(
          "messages",
          server.sendMessage(chat)
        );
      } else if (validator.isLatLong(obj.message)) {
        const strsplit = obj.message.split(',');
        const objCoords = JSON.stringify({lati: strsplit[0]*1, long: strsplit[1]*1});
        const loc = await server.location(objCoords);
        io.to(server.user.chatroom._id).emit(
          "messages",
          server.sendMessage(loc)
        );
      } else if (validator.isURL(obj.message, {require_protocol: true, require_valid_protocol: true}) && !newRegexImg.test(obj.message) && !newRegexYT.test(obj.message)) {
        const urlmsg = await server.generateURLMsg(obj.message);
        io.to(server.user.chatroom._id).emit(
          "messages",
          server.sendMessage(urlmsg)
        );
      } else {
        const chat = await server.chat(obj.message);
        io.to(server.user.chatroom._id).emit(
          "messages",
          server.sendMessage(chat)
        );
      }
      callback();
    } catch (err) {
      return callback({ ok: false, message: err.message });
    }
  });

  socket.on("sendLocation", async (obj, callback) => {
    try {
      const server = await Server.checkUser(socket.id);

      const filter = new Filter();
      if (filter.isProfane(obj.message)) {
        return callback({
          ok: true,
          data: server.sendProfanityNotification(),
        });
      }

      const chat = await server.location(obj.message);

      io.to(server.user.chatroom._id).emit(
        "messages",
        server.sendMessage(chat)
      );
      callback();
    } catch (err) {
      return callback({ ok: false, message: err.message });
    }
    callback();
  });

  socket.on("leaveRoom", async (_, callback) => {
    try {
      const server = await Server.checkUser(socket.id);
      await server.leaveRoom();
      socket.broadcast
        .to(server.user.chatroom._id)
        .emit("messages", server.sendUserLeaveMessage());
      socket.leave(server.user.chatroom._id);
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const server = await Server.checkUser(socket.id);
      socket.broadcast
        .to(server.user.chatroom._id)
        .emit("messages", server.sendUserLeaveMessage());
      await server.userLogout(); 
      await server.userOutRoom(socket.id);
      socket.leave(server.user.chatroom._id);
      io.emit("allRoom", await Server.allRoom());
    } catch (err) {
      console.log(err.message);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on: ${port}`);
});