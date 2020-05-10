import React, { useRef, useEffect } from "react";
import { DisplayMapFC } from "./Map";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { useStyles } from "../utils/color";
import Avatar from "@material-ui/core/Avatar";

let moment = require("moment");

export default function Content() {
  const classes = useStyles();
  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });
  const messages = useSelector((state) => state.messages);
  const user = useSelector((state) => state.user);
  const oldmsg = useSelector((state) => state.oldMessages);

  const html =
    messages &&
    messages.map((el) => {
      console.log(el)
      const keysColor = Object.keys(classes);
      const keyChosen = keysColor.filter((i) => i === el.user.avatarColor);
      const objChosen = keyChosen.map((i) => classes[i])[0];
      return (
        <div
          className={user._id === el.user.id ? "message right" : "message left"}
        >
          <div className="message__name">{el.user.name}</div>
          <div className="data">
          <div className="avatar-name">
          <div className="content-msg">
            {el.isCoords ? (
                <DisplayMapFC coords={JSON.parse(el.chat)} />
            ) : el.isUrl ? (
                <a href={el.chat} target="_blank">{el.chat}</a>
            ) : el.isImg ? (
                <img
                  src={el.chat}
                  width="400px"
                  height="auto"
                  alt={el.chat}
                ></img>
            ) : el.isYTube ? (
                <ReactPlayer url={el.chat} width="400px" height="400px" loop />
            ) : (
              <span>{el.chat}</span>
            )}
            </div>
            <div className={classes.root}>
            <Avatar
              alt={el.user.name}
              src="/broken-image.jpg"
              className={objChosen}
            />
          </div>
          </div>
            <div className="message_meta">
              {moment(el.createdAt).format("D/MM/YY - h:mm A")}
            </div>
          </div>
        </div>
      );
    });
  const oldhtml = oldmsg.map((el) => {
    const keysColor = Object.keys(classes);
    const keyChosen = keysColor.filter((i) => i === el.username.avatarColor);
    const objChosen = keyChosen.map((i) => classes[i])[0];
    return (
      <div
        className={
          user._id === el.username.id ? "message right" : "message left"
        }
      >
        <div className="message__name">{el.username.name}</div>
        <div className="data">
          <div className="avatar-name">
          <div className="content-msg">
            {el.isCoords ? (
                <DisplayMapFC coords={JSON.parse(el.message)} />
            ) : el.isUrl ? (
                <a href={el.message} target="_blank">{el.message}</a>
            ) : el.isImg ? (
                <img
                  src={el.message}
                  width="400px"
                  height="auto"
                  alt={el.message}
                ></img>
            ) : el.isYTube ? (
                <ReactPlayer
                  url={el.message}
                  width="400px"
                  height="400px"
                  loop
                />
            ) : (
              <span>{el.message}</span>
            )}
            </div>
            <div className={classes.root}>
              <Avatar
                alt={el.username.name}
                src="/broken-image.jpg"
                className={objChosen}
              />
            </div>
          </div>
          <div className="message_meta">
            {moment(el.createdAt).format("D/MM/YY - h:mm A")}
          </div>
        </div>
      </div>
    );
  });

  if (!messages) {
    return <div>On loading</div>;
  }
  return (
    <div className="chat__messages">
      <div id="message-template">
        {oldhtml}
        {html}
        <div ref={divRef}></div>
      </div>
    </div>
  );
}
