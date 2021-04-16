import React from "react";
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
  currentRoom: null,
  page: 1,
  loadMore: true,
};

export const ACTIONS = {
  SET_USER: "CHAT/SET_USER",
  SET_MESSAGES: "CHAT/SET_MESSAGES",
  SET_EMPTY_MESSAGES: "CHAT/SET_EMPTY_MESSAGES",
  SET_OLD_MESSAGES: "CHAT/SET_OLD_MESSAGES",
  SET_ROOM: "CHAT/SET_ROOM",
  CURRENT_ROOM: "CHAT/CURRENT_ROOM",
  SET_PAGE: "CHAT/SET_PAGE",
  SET_LOAD_MORE: "CHAT/SET_LOAD_MORE",
  RESET_STATE: "CHAT/RESET_STATE",
  LEAVE_ROOM: "CHAT/LEAVE_ROOM",
};

function chatReducers(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_USER: {
      state.user = action.payload;
      const nextState = { ...state, user: state.user };
      return nextState;
    }
    case ACTIONS.SET_MESSAGES: {
      state.messages.push(action.payload);
      const nextState = { ...state, messages: state.messages };
      return nextState;
    }
    case ACTIONS.SET_EMPTY_MESSAGES: {
      const nextState = { ...state, messages: [] };
      return nextState;
    }
    case ACTIONS.SET_ROOM: {
      state.room = action.payload;
      const nextState = { ...state, room: state.room };
      return nextState;
    }
    case ACTIONS.SET_OLD_MESSAGES: {
      state.oldMessages = [...action.payload, ...state.oldMessages];
      const nextState = { ...state, oldMessages: state.oldMessages };
      return nextState;
    }
    case ACTIONS.CURRENT_ROOM: {
      state.currentRoom = action.payload;
      const nextState = { ...state, currentRoom: state.currentRoom };
      return nextState;
    }
    case ACTIONS.SET_PAGE: {
      state.page += 1;
      const nextState = { ...state, page: state.page };
      return nextState;
    }
    case ACTIONS.SET_LOAD_MORE: {
      const nextState = { ...state, loadMore: false };
      return nextState;
    }
    case ACTIONS.RESET_STATE: {
      return initialState;
    }
    case ACTIONS.LEAVE_ROOM: {
      const nextState = {
        ...initialState,
        user: state.user,
        room: state.room,
      };
      return nextState;
    }
    default:
      return state;
  }
}

const store = createStore(
  chatReducers,
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

serviceWorker.unregister();
