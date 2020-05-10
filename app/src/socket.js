import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:4050");


export default socket;