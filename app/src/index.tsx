// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import uniq from 'lodash/uniq'

const initialState = {
  messages: [],
  user: null,
  room: [],
  currentRoom: null,
  page: 1,
  loadMore: true
}

export const ACTIONS = {
  SET_USER: 'CHAT/SET_USER',
  SET_MESSAGES: 'CHAT/SET_MESSAGES',
  SET_OLD_MESSAGES: 'CHAT/SET_OLD_MESSAGES',
  SET_ROOM: 'CHAT/SET_ROOM',
  CURRENT_ROOM: 'CHAT/CURRENT_ROOM',
  SET_PAGE: 'CHAT/SET_PAGE',
  SET_LOAD_MORE: 'CHAT/SET_LOAD_MORE',
  RESET_STATE: 'CHAT/RESET_STATE',
  LEAVE_ROOM: 'CHAT/LEAVE_ROOM'
}

function chatReducers(state = initialState, action: any) {
  switch (action.type) {
    case ACTIONS.SET_USER: {
      const nextState = { ...state, user: action.payload }
      return nextState
    }
    case ACTIONS.SET_MESSAGES: {
      const messages = uniq([...state.messages, action.payload])
      const nextState = { ...state, messages }
      return nextState
    }
    case ACTIONS.SET_ROOM: {
      const nextState = { ...state, room: action.payload }
      return nextState
    }
    case ACTIONS.SET_OLD_MESSAGES: {
      const messages = uniq([...action.payload, ...state.messages])
      const nextState = { ...state, messages }
      return nextState
    }
    case ACTIONS.CURRENT_ROOM: {
      const nextState = { ...state, currentRoom: action.payload }
      return nextState
    }
    case ACTIONS.SET_PAGE: {
      const nextState = { ...state, page: state.page + 1 }
      return nextState
    }
    case ACTIONS.SET_LOAD_MORE: {
      const nextState = { ...state, loadMore: false }
      return nextState
    }
    case ACTIONS.RESET_STATE: {
      return { ...initialState, room: state.room }
    }
    case ACTIONS.LEAVE_ROOM: {
      const nextState = {
        ...initialState,
        messages: [],
        user: state.user,
        room: state.room
      }
      return nextState
    }
    default:
      return state
  }
}

const store = createStore(
  chatReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
