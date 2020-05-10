import React, { useState } from "react";
import "../styles/styles.min.css";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Login(props) {
  const classes = useStyles();
  let [attribute, setAttribute] = useState(false);
  const colors = [
    "orange",
    "red",
    "purple",
    "indigo",
    "teal",
    "amber",
    "blueGrey",
    "cyan",
  ];
  const dispatch = useDispatch();
  let allroom = useSelector((state) => state.room);
  let [user, setUser] = useState(null);
  let [createRoom, setCreateRoom] = useState(null);
  let [chatroom, setChatRoom] = useState("");
  let history = useHistory();

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "room") {
      setChatRoom({
        ...chatroom,
        [name]: value,
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  const onSubmit = (e) => {
    setAttribute(true);
    e.preventDefault();
    const randomIndexColor = Math.floor(Math.random()*colors.length);
    const userSubmit = {...user, avatarColor: colors[randomIndexColor]}
    socket.emit("join", userSubmit, (err) => {
      if (err) return console.log(err);
    });
    dispatch({ type: "SET_TEMPERATE", payload: null });
    window.setTimeout(() => {
      setAttribute(false);
      history.push("/chat");
    }, 500);
  };

  const addNewRoom = (e) => {
    setAttribute(true);
    e.preventDefault();
    socket.emit("addRoom", chatroom, (err) => {
      if (err) setCreateRoom(err);
    });
    setChatRoom("");
    setAttribute(false);
  };
  const roomToHtml = allroom
    ? allroom.map((item) => {
        return (
          <MenuItem value={item._id} key={item.chatroom}>
            {item.chatroom}
          </MenuItem>
        );
      })
    : [];
  return (
    <div className="centered-form">
      <div className="centered-form__box">
        <h1>Join</h1>
        <form onSubmit={onSubmit}>
          <TextField
            onChange={onChange}
            required
            id="standard-required"
            name="username"
            label="Display Name"
            style={{ marginBottom: "10px" }}
            autoComplete="off"
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="room-select">Room</InputLabel>
            <Select
              labelId="room-select"
              defaultValue=""
              id="room-select"
              name="chatroom"
              onChange={onChange}
            >
              {roomToHtml}
            </Select>
            <button
              className="button-chat"
              style={{ width: "100%", marginTop: "15px" }}
              disabled={attribute}
            >
              Join
            </button>
          </FormControl>
        </form>
        {createRoom ? (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {createRoom}
          </p>
        ) : null}
        <form onSubmit={addNewRoom}>
          <TextField
            onChange={onChange}
            required
            value={chatroom && chatroom.room}
            id="standard-required"
            name="room"
            label="Add new Room"
            style={{ marginBottom: "10px" }}
            autoComplete="off"
          />
          <button
            className="button-chat"
            style={{ width: "100%", marginTop: "15px" }}
            disabled={attribute}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
