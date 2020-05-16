import React from "react";
import socket from "../socket";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


export default function Sidebar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);

  if (room.length === 0 || !user) {
    return(
      <div className="chat__sidebar">
      <div id="sidebar-template">
        <h2 className="room-title">{user && user.name}</h2>
        <h3 className="list-title" style={{display: 'none'}}></h3>
      </div>
    </div>
    )
  }

  const emptyMsg = () => {
    dispatch({ type: "SET_EMPTYMESSAGES", payload: [] })
  }

  const onChooseRoom = (id) => {
    const obj = {username: user.name, chatroom: id, page: 1, limit: 20}
    dispatch({type: "LEAVE_ROOM"});
    window.setTimeout(() => {
      socket.emit("join", obj, err => {
        if (err) console.log(err)
      })
    }, 200)

}

const backToLoginPage = (e) => {
  e.preventDefault();
  dispatch({type: "STATE_DEFAULT"});
    history.push('/')
}

const roomRender = room.map((el) => {
    return <h3 className={`list-title ${(user.chatroom._id === el._id) ?'list-title-choose' : 'none-choose'}`} onClick={() => {
        socket.emit("leaveRoom");
        emptyMsg();
        window.setTimeout(() => {
          onChooseRoom(el._id)
       }, 200)
    }}>{el.chatroom} - {el.username.length}</h3>;
  });
  return (
    <div className="chat__sidebar">
      <div className="sidebar-template">
        <h2 className="room-title">{user && user.name}</h2>
        {roomRender}
      </div>
      <div className="sidebar-template-bottom">
      <button onClick={backToLoginPage} className="button-chat">Back to login page</button>
      </div>
    </div>
  );
}
