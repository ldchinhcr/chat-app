import React from 'react';
import { DisplayMapFC } from "./Map";
import { EmojiReg } from "../utils/EmojsRegex";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import Avatar from "@material-ui/core/Avatar";
import { useStyles } from "../utils/color";
import socket from "../socket";


let moment = require("moment");
moment.updateLocale('en', {
  relativeTime : {
      past: function(input) {
        return input === 'just now'
          ? input
          : input + ' ago'
      },
      s  : 'just now',
      future: "in %s",
      ss : '%d seconds',
      m:  "a minute",
      mm: "%d minutes",
      h:  "an hour",
      hh: "%d hours",
      d:  "a day",
      dd: "%d days",
      M:  "a month",
      MM: "%d months",
      y:  "a year",
      yy: "%d years"
  }
});

export default function OldMsg() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const page = useSelector((state) => state.page);
    const oldmsg = useSelector((state) => state.oldMessages);
    const loadMoreButton = useSelector((state) => state.loadMore);
  const user = useSelector((state) => state.user);


    const loadMore = (e) => {
        e.preventDefault();
          const obj = { page: page + 1, limit: 20 };
          if (!loadMoreButton) {
            return;
          }
            socket.emit("fetchOldMsg", obj, err => {
            if (err) {
              dispatch({ type: "SET_LOADMORE" });
              return console.log(err);
            }
            dispatch({ type: "SET_PAGE" });
          })
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
                    <a href={el.message} target="_blank" rel="noopener noreferrer">
                      {el.message}
                    </a>
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
                    <span>{textToHTML}</span>
                  )}
                </div>
                <div className={classes.root}>
                  <Avatar
                    alt={el.username.name}
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
    
    if (oldmsg.length === 0 ) {
        return (
            <div></div>
        )
    }
    return (
        <div>
    {(oldhtml.length >= 20) && loadMoreButton ? <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}><button onClick={loadMore} className="chat__loadMore">Load more</button></div> : null}
        {oldhtml}
        </div>
    )
}
