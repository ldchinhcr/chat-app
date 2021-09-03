import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { useSelector } from "react-redux";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";

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
  let [isRequesting, setIsRequesting] = useState(false);
  const allRooms = useSelector((state) => state.room);
  const page = useSelector((state) => state.page);
  const loggedUser = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();

  const onChange = useCallback(
    (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setUser({
        ...user,
        [name]: value,
      });
    },
    [user]
  );

  useEffect(() => {
    if (!allRooms) {
      setIsLoading(true);
    }
    if (allRooms) {
      setIsLoading(false);
    }
  }, [allRooms]);

  useEffect(() => {
    if (loggedUser) {
      history.push("/chat");
    }
  }, [loggedUser, history, isRequesting]);

  const onSubmit = useCallback(
    async (e) => {
      if (!user.chatroom || !user.username) {
        return
      }
      setIsRequesting(true);
      e.preventDefault();
      const randomIndexColor = Math.floor(Math.random() * colors.length);
      const userObj = {
        ...user,
        avatarColor: colors[randomIndexColor],
        page: page,
        limit: 20,
      };
      try {
        if (socket) {
          await socket.emit(SOCKET_EVENTS.join, userObj, (err) => {
            if (err) throw err;
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [page, user]
  );

  const roomToHtml = useMemo(() => {
    if (isLoading) {
      return <div>Is Loading...</div>;
    }
    return (allRooms || []).map((item) => {
      return (
        <MenuItem value={item._id} key={item.chatroom}>
          {item.chatroom}
        </MenuItem>
      );
    });
  }, [allRooms, isLoading]);

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
              disabled={isRequesting}
            >
              {isRequesting && !user ? 'Joining ...' : 'Join'}
            </button>
          </FormControl>
        </form>
      </div>
    </div>
  );
}
