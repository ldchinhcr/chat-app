import React from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ACTIONS as CHAT_ACTIONS } from "../index";

export default function Sidebar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    if (!user && !room?.length) {
      history.push("/");
    }
  }, [user, room, history]);

  const emptyMsg = React.useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.SET_EMPTY_MESSAGES });
  }, [dispatch]);

  const onChooseRoom = React.useCallback(
    async (id) => {
      const obj = { username: user.name, chatroom: id, page: 1, limit: 20 };
      dispatch({ type: CHAT_ACTIONS.LEAVE_ROOM });
      try {
        await socket.emit(SOCKET_EVENTS.join, obj, (err) => {
          if (err) throw err;
        });
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, user.name]
  );

  const backToLoginPage = React.useCallback(
    (e) => {
      e.preventDefault();
      dispatch({ type: CHAT_ACTIONS.RESET_STATE });
    },
    [dispatch]
  );

  const selectRoom = React.useCallback(
    async (el) => {
      await socket.emit(SOCKET_EVENTS.leaveRoom);
      await emptyMsg();
      const timer = setTimeout(() => {
        onChooseRoom(el._id);
      }, 200);
      return () => clearTimeout(timer);
    },
    [emptyMsg, onChooseRoom]
  );

  const roomRender = room.map((el) => {
    return (
      <h3
        className={`list-title ${
          user.chatroom._id === el._id ? "list-title-choose" : "none-choose"
        }`}
        onClick={() => selectRoom(el)}
      >
        {el.chatroom} - {el.username.length}
      </h3>
    );
  });
  return (
    <div className="chat__sidebar">
      <div className="sidebar-template">
        <h2 className="room-title">{user && user.name}</h2>
        {roomRender}
      </div>
      <div className="sidebar-template-bottom">
        <button onClick={backToLoginPage} className="button-chat">
          Back to login page
        </button>
      </div>
    </div>
  );
}
