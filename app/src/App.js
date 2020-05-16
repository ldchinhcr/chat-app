import React,{useEffect, useState, useCallback} from 'react';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import Login from './views/Login';
import Chat from './views/Chat';
import socket from "./socket";
import { useDispatch} from "react-redux";


function App() {
  const dispatch = useDispatch();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  useEffect(() => {
    socket.emit("fetchRoom");
    socket.on("allRoom", room => {
      dispatch({ type: "SET_ROOM", payload: room });
      window.setTimeout(()=> {
        forceUpdate();
      },800)
    })
    socket.on("selectedRoom", room => {
      dispatch({ type: "CURRENT_ROOM", payload: room });
      window.setTimeout(()=> {
        forceUpdate();
      },800)
    })
    socket.on("setUser", obj => {
      dispatch({ type: "SET_USER", payload: obj });
      window.setTimeout(()=> {
        forceUpdate();
      },1000)
    })
    socket.on("messages", obj => {
      dispatch({ type: "SET_MESSAGES", payload: obj });
      window.setTimeout(()=> {
        forceUpdate();
      },800)
    })
    socket.on("oldmessages", obj => {
      dispatch({ type: "SET_OLDMESSAGES", payload: obj });
      window.setTimeout(()=> {
        forceUpdate();
      },1000)
    })
  },[])

  return (
    <Switch>
      <Route path='/' exact render={(props) => <Login {...props}/>} />
      <Route path='/chat' render={(props) => <Chat {...props}/>} />
      <Route path='/*' component={notFound} />
    </Switch>
  );
}

const notFound = () => {
  return (
    <div className="notfound"></div>
  )
}

export default App;
