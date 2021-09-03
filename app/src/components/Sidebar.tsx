import React, { useMemo, useCallback, useEffect } from 'react'
import socket from '../socket'
import { SOCKET_EVENTS, USER_LOCAL_STORAGE_KEY } from '../constants'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ACTIONS as CHAT_ACTIONS } from '../index'
import SkeletonLoading from './Skeleton'
import cx from 'classnames'
import { ChatRoom, User } from 'interfaces'

interface SidebarProps {
  room?: Array<ChatRoom>
  user: User
  isChoosingRoom: boolean
  setIsChoosingRoom: React.Dispatch<React.SetStateAction<boolean>>
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { room, user } = props

  useEffect(() => {
    if (!user && !room?.length) {
      history.push('/')
    }
  }, [user, room, history])

  const onChooseRoom = useCallback(
    async (id) => {
      if (props.isChoosingRoom) {
        return
      }
      props.setIsChoosingRoom(true)
      props.setIsCollapsed(true)
      const obj = { username: user.name, chatroom: id, page: 1, limit: 20 }
      dispatch({ type: CHAT_ACTIONS.LEAVE_ROOM })
      try {
        socket.emit(SOCKET_EVENTS.leaveRoom)
        socket.emit(SOCKET_EVENTS.join, obj)
      } catch (error) {
        console.error(error)
        props.setIsChoosingRoom(false)
      }
    },
    [dispatch, user.name, props]
  )

  const backToLoginPage = useCallback(
    (e) => {
      e.preventDefault()
      dispatch({ type: CHAT_ACTIONS.RESET_STATE })
      try {
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(null))
      } catch (err) {
        console.error(err)
      } finally {
        history.push('/')
      }
    },
    [dispatch, history]
  )

  const roomRender = useMemo(() => {
    if (!room?.length) {
      return <SkeletonLoading />
    }
    return room.map((el, idx) => {
      return (
        <h3
          key={el._id + idx}
          className={cx('list-title', {
            disabled: props.isChoosingRoom,
            'list-title-choose': user.chatroom._id === el._id
          })}
          onClick={() => onChooseRoom(el._id)}
        >
          {el.chatroom} - {el.username?.length}
        </h3>
      )
    })
  }, [room, onChooseRoom, user.chatroom, props.isChoosingRoom])

  return (
    <div className="chat__sidebar">
      <div className="sidebar-template">
        <h2 className="room-title">{user.name}</h2>
        {roomRender}
      </div>
      <div className="sidebar-template-bottom">
        <button onClick={backToLoginPage} className="button-chat">
          Back to login page
        </button>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
