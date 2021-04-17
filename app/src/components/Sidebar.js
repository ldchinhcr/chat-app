import React from "react";
import socket from "../socket";
import { SOCKET_EVENTS, USER_LOCAL_STORAGE_KEY } from "../constants";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ACTIONS as CHAT_ACTIONS } from "../index";

export default function Sidebar(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { room, user } = props

  React.useEffect(() => {
    if (!user && !room?.length) {
      history.push("/");
    }
  }, [user, room, history]);

  const onChooseRoom = React.useCallback(
    async (id) => {
      props.setIsChoosingRoom(true)
      props.setIsCollapsed(true)
      const obj = { username: user.name, chatroom: id, page: 1, limit: 20 };
      dispatch({ type: CHAT_ACTIONS.LEAVE_ROOM });
      try {
        socket.emit(SOCKET_EVENTS.leaveRoom);
        socket.emit(SOCKET_EVENTS.join, obj);
      } catch (error) {
        console.error(error);
        props.setIsChoosingRoom(false)
      }
    },
    [dispatch, user.name, props]
  );

  const backToLoginPage = React.useCallback(
    (e) => {
      e.preventDefault();
      dispatch({ type: CHAT_ACTIONS.RESET_STATE });
      try {
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(null));
      } catch (err) {
        console.error(err);
      } finally {
        history.push("/");
      }
    },
    [dispatch, history]
  );

  const roomRender = room.map((el, idx) => {
    return (
      <h3
        key={el._id + idx}
        className={`list-title ${
          user.chatroom._id === el._id ? "list-title-choose" : "none-choose"
        }`}
        onClick={() => onChooseRoom(el._id)}
      >
        {el.chatroom} - {el.username.length}
      </h3>
    );
  });
  return (
    <div className="chat__sidebar">
      <div className="sidebar-template">
        <h2 className="room-title">{user.name}</h2>
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
