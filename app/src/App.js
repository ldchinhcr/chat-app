import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Login from "./views/Login";
import Chat from "./views/Chat";
import socket from "./socket";
import { useDispatch } from "react-redux";
import { ACTIONS as CHAT_ACTIONS } from "./index";
import { SOCKET_EVENTS } from "./constants";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(SOCKET_EVENTS.allRoom, (rooms) => {
      dispatch({ type: CHAT_ACTIONS.SET_ROOM, payload: rooms });
    });
    socket.on(SOCKET_EVENTS.selectedRoom, (room) => {
      dispatch({ type: CHAT_ACTIONS.CURRENT_ROOM, payload: room });
    });
    socket.on(SOCKET_EVENTS.setUser, (user) => {
      dispatch({ type: CHAT_ACTIONS.SET_USER, payload: user });
    });
    socket.on(SOCKET_EVENTS.messages, (msgs) => {
      dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: msgs });
    });
    socket.on(SOCKET_EVENTS.oldmessages, (msgs) => {
      dispatch({ type: CHAT_ACTIONS.SET_OLD_MESSAGES, payload: msgs });
    });
  }, [dispatch]);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.fetchRoom);
  }, [])

  return (
    <Switch>
      <Route path="/" exact render={(props) => <Login {...props} />} />
      <Route path="/chat" render={(props) => <Chat {...props} />} />
      <Route path="/*" component={notFound} />
    </Switch>
  );
}

const notFound = () => {
  return <div className="notfound"></div>;
};

export default App;
