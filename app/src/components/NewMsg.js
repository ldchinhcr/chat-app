import React, { useRef, useEffect, useCallback, useState } from "react";
import { DisplayMapFC } from "./Map";
import { EmojiReg } from "../utils/EmojsRegex";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import Avatar from "@material-ui/core/Avatar";
import { useStyles } from "../utils/color";

let moment = require("moment");
moment.updateLocale("en", {
  relativeTime: {
    past: function (input) {
      return input === "just now" ? input : input + " ago";
    },
    s: "just now",
    future: "in %s",
    ss: "%d seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export default function NewMsg() {
  const classes = useStyles();
  const messages = useSelector((state) => state.messages);

  const user = useSelector((state) => state.user);

  const divRef = useRef(null);

  const scrollToBottom = () => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const html =
    messages &&
    messages.map((el) => {
      const keysColor = Object.keys(classes);
      const keyChosen = keysColor.filter((i) => i === el.user.avatarColor);
      const objChosen = keyChosen.map((i) => classes[i])[0];
      let textToHTML;
      if (!el.isUrl && !el.isCoords && !el.isImg && !el.isYTube) {
        textToHTML = EmojiReg(el.chat);
      }
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
                  <a href={el.chat} target="_blank" rel="noopener noreferrer">
                    {el.chat}
                  </a>
                ) : el.isImg ? (
                  <img
                    src={el.chat}
                    width="400px"
                    height="auto"
                    alt={el.chat}
                  ></img>
                ) : el.isYTube ? (
                  <ReactPlayer
                    url={el.chat}
                    width="400px"
                    height="400px"
                    loop
                  />
                ) : (
                  <span>{textToHTML}</span>
                )}
              </div>
              <div className={classes.root}>
                <Avatar
                  alt={el.user.name}
                  src="/broken-image.jpg"
                  className={objChosen}
                ></Avatar>
              </div>
            </div>
            <div className="message_meta">{moment(el.createdAt).fromNow()}</div>
          </div>
        </div>
      );
    });

  useEffect(() => {
    scrollToBottom();
  }, [html]);

  if (!messages) {
    return <div>On loading</div>;
  }

  return (
    <div>
      {html}
      <div ref={divRef}></div>
    </div>
  );
}
