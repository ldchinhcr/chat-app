import React from "react";
import { DisplayMapFC } from "./Map";
import { EmojiReg } from "../utils/EmojsRegex";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import Avatar from "@material-ui/core/Avatar";
import { useStyles } from "../utils/color";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { ACTIONS as CHAT_ACTIONS } from "../index";
import DefaultAvatar from "../assets/broken-image.png";
import BrokenImage from "../assets/images.png";

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

export default function OldMsg() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const page = useSelector((state) => state.page);
  const oldmsg = useSelector((state) => state.oldMessages);
  const loadMoreButton = useSelector((state) => state.loadMore);
  const user = useSelector((state) => state.user);

  const loadMore = React.useCallback(
    async (e) => {
      e.preventDefault();
      const obj = { page: page + 1, limit: 20 };
      if (!loadMoreButton) {
        return;
      }
      try {
        await socket.emit(SOCKET_EVENTS.fetchOldMsg, obj, (err) => {
          if (err) {
            dispatch({ type: CHAT_ACTIONS.SET_LOAD_MORE });
            throw err;
          }
          dispatch({ type: CHAT_ACTIONS.SET_PAGE });
        });
      } catch (err) {
        console.error(err);
      }
    },
    [loadMoreButton, dispatch, page]
  );

  const displayContent = (el, text) => {
    if (el.isCoords) {
      return <DisplayMapFC coords={JSON.parse(el.message)} />;
    }
    if (el.isUrl) {
      return (
        <a href={el.message} target="_blank" rel="noopener noreferrer">
          {el.message}
        </a>
      );
    }
    if (el.isImg) {
      return (
        <img
          src={el.message}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = BrokenImage;
          }}
          width="400px"
          height="auto"
          alt={el.message}
        />
      );
    }
    if (el.isYTube) {
      return <ReactPlayer url={el.message} width="400px" height="400px" loop />;
    }
    return <span>{text}</span>;
  };

  const oldhtml = oldmsg.map((el) => {
    const keysColor = Object.keys(classes);
    const keyChosen = keysColor.filter((i) => i === el.username.avatarColor);
    const objChosen = keyChosen.map((i) => classes[i])[0];
    let textToHTML;
    if (!el.isUrl && !el.isCoords && !el.isImg && !el.isYTube) {
      textToHTML = EmojiReg(el.message);
    }
    return (
      <div
        key={el._id}
        className={
          user._id === el.username.id ? "message right" : "message left"
        }
      >
        <div className="message__name">{el.username.name}</div>
        <div className="data">
          <div className="avatar-name">
            <div className="content-msg">{displayContent(el, textToHTML)}</div>
            <div className={classes.root}>
              <Avatar
                alt={el.username.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultAvatar;
                }}
                className={objChosen}
              />
            </div>
          </div>
          <div className="message_meta">{moment(el.createdAt).fromNow()}</div>
        </div>
      </div>
    );
  });

  if (oldmsg.length === 0) {
    return <div></div>;
  }
  return (
    <div>
      {oldhtml.length >= 20 && loadMoreButton ? (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <button onClick={loadMore} className="chat__loadMore">
            Load more
          </button>
        </div>
      ) : null}
      {oldhtml}
    </div>
  );
}
