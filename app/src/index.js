import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
  oldMessages: [],
  messages: [],
  user: null,
  room: [],
  currentRoom: null
};

function userChat(state = initialState, action) {
  switch (action.type) {
    case "SET_USER": {
      state.user = action.payload;
      let nextState = { ...state, user: state.user };
      return nextState;
    }
    case "SET_MESSAGES": {
      state.messages.push(action.payload);
      let nextState = { ...state, messages: state.messages };
      return nextState;
    }
    case "SET_EMPTYMESSAGES": {
      state.messages = [];
      let nextState = { ...state, messages: state.messages };
      return nextState;
    }
    case "SET_ROOM": {
      state.room = action.payload;
      let nextState = { ...state, room: state.room };
      return nextState;
    }
    case "SET_OLDMESSAGES": {
      state.oldMessages = action.payload;
      let nextState = { ...state, oldMessages: state.oldMessages };
      return nextState;
    }
    case "CURRENT_ROOM": {
      state.currentRoom = action.payload;
      let nextState = { ...state, currentRoom: state.currentRoom };
      return nextState;
    }
    case "STATE_DEFAULT": {
      const nextState = {
        oldMessages: [],
        messages: [],
        user: null,
        room: state.room,
        currentRoom: null
      }
      return nextState;
    }
    default:
      return state;
  }
}

const store = createStore(
  userChat,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
