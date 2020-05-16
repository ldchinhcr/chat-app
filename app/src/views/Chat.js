import React, { useState, useEffect } from "react";
import "../styles/styles.min.css";
import Content from "../components/Content";
import Sidebar from "../components/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import socket from "../socket";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import { Smile } from "react-feather";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker, NimbleEmojiIndex  } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import { getByNative } from "../utils/regexCheckEmoji";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Chat() {
  const emojiIndex = new NimbleEmojiIndex(data)
  const classes = useStyles();
  let [attribute, setAttribute] = useState(false);
  const user = useSelector((state) => state.user);
  let [input, setInput] = useState("");
  let [showEmojiPicker, setShowEmojiPicker] = useState(false);
  let [nothingValue, setValue] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      socket.on("allRoom", (room) => {
        dispatch({ type: "SET_ROOM", payload: room });
      });
    }
    window.setTimeout(() => {
      setValue((value) => ++value);
    }, 2000);
  }, []);

  const onChange = (e) => {
    const emoji = getByNative(e.target.value);
    if (emoji) {
      setInput(emoji.native);
    } else {
      setInput(e.target.value);
    }
  };

  const onHandleSubmit = () => {
    setAttribute(true);
    const obj = {
      user: { id: user._id, name: user.name },
      message: input,
      chatroom: user.chatroom._id,
      sid: user.sid,
    };
    socket.emit("sendInputMsg", obj, (err) => {
      if (err) console.log(err);
      console.log("Delivered!");
      setInput("");
      setAttribute(false);
    });
    window.setTimeout(() => {
      setValue((value) => ++value);
    }, 2000);
  };

  const onSendLocation = (e) => {
    e.preventDefault();
    setAttribute(true);
    if (!navigator.geolocation) {
      alert("Your browser not support send location");
      setAttribute(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coords = JSON.stringify({
        lati: position.coords.latitude,
        long: position.coords.longitude,
      });
      const obj = {
        user: { id: user._id, name: user.name },
        message: coords,
        chatroom: user.chatroom._id,
        sid: user.sid,
      };
      socket.emit("sendLocation", obj, (err) => {
        if (err) console.log(err);
      });
    });
    window.setTimeout(() => {
      setAttribute(false);
    }, 1500);
    setInput("");
    window.setTimeout(() => {
      setValue((value) => ++value);
    }, 2000);
  };

  function toggleEmojiPicker() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onHandleSubmit();
    }
  }

  function addEmoji(emoji) {
    const text = `${input}${emoji.native}`;
    setInput(text);
    setShowEmojiPicker(false);
  }

  if (!user) {
    return (
      <div className="img-cover" style={{ overflow: "hidden" }}>
        <Button
          variant="contained"
          onClick={() => {
            history.push("/");
          }}
        >
          Click here redirect to Login Page
        </Button>
      </div>
    );
  }

  return (
    <div className="chat">
      <CssBaseline />
      <Sidebar id="sidebar" />

      <div className="chat__main">
        <Content id="messages" />
        {showEmojiPicker ? (
          <NimblePicker
            set="facebook"
            title="Pick an icon"
            data={data}
            onSelect={addEmoji}
          />
        ) : null}
        <div className="compose">
          <Button
            color="primary"
            className={classes.button}
            onClick={onSendLocation}
            disabled={attribute}
          >
            <NavigationIcon className={classes.extendedIcon} />
            My Location
          </Button>
          <button
            type="button"
            className="toggle-emoji"
            onClick={toggleEmojiPicker}
          >
            <Smile />
          </button>
          <form id="message-form">
            <ReactTextareaAutocomplete
              className="message-input"
              name="message"
              value={input}
              loadingComponent={() => <span>Loading</span>}
              onKeyPress={handleKeyPress}
              onChange={onChange}
              placeholder="Compose your message and hit ENTER to send"
              required
              trigger={{
                ":": {
                  dataProvider: (token) => 
                    emojiIndex.search(token).map((o) => ({
                      name: o.name,
                      native: o.native,
                    }))
                    ,
                  component: ({ entity: { native, name } }) => (
                    <div>{`${name} ${native}`}</div>
                  ),
                  output: (item) => `${item.native}`,
                },
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
