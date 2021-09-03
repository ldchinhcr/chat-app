import React, { useRef, useEffect, useState } from 'react'
import { DisplayMapFC } from './Map'
import { EmojiReg } from '../utils/EmojsRegex'
import ReactPlayer from 'react-player'
import Avatar from '@material-ui/core/Avatar'
import { useStyles } from '../utils/color'
import DefaultAvatar from '../assets/broken-image.png'
import BrokenImage from '../assets/images.png'
import { normalizeMessages } from '../utils/messages_helper'
import { useDispatch } from 'react-redux'
import socket from '../socket'
import { SOCKET_EVENTS } from '../constants'
import { ACTIONS as CHAT_ACTIONS } from '../index'
import Loading from './Loading'
import { useReactResponsive } from '../hooks'
import { ContentProps } from './Content'

const moment = require('moment')
moment.updateLocale('en', {
  relativeTime: {
    past: function (input: string) {
      return input === 'just now' ? input : input + ' ago'
    },
    s: 'just now',
    future: 'in %s',
    ss: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
})

const Messages: React.FC<ContentProps> = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isLoadMore, setIsLoadMore] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const {
    page,
    messages,
    loadMoreButton,
    user,
    currentRoom,
    isChoosingRoom,
    setIsChoosingRoom
  } = props
  const normalizedMsgs = normalizeMessages(messages)
  const oldMsgs = useRef(normalizedMsgs)
  const { isMobile } = useReactResponsive()
  const sizeContainer = isMobile ? '250px' : '400px'

  useEffect(() => {
    if (isChoosingRoom && currentRoom) {
      setIsChoosingRoom(false)
    }
  }, [isChoosingRoom, currentRoom, setIsChoosingRoom])

  const scrollToBottom = React.useCallback(() => {
    !isLoadMore &&
      divRef.current &&
      divRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [isLoadMore])

  useEffect(() => {
    if (oldMsgs.current.length !== normalizedMsgs.length) {
      if (isLoadMore) {
        setIsLoadMore(false)
      } else {
        scrollToBottom()
      }
      oldMsgs.current = normalizedMsgs
    }
    // eslint-disable-next-line
  }, [normalizedMsgs])

  const loadMore = React.useCallback(
    async (e) => {
      e.preventDefault()
      setIsLoadMore(true)
      const obj = { page: page + 1, limit: 20 }
      if (!loadMoreButton) {
        return
      }
      try {
        await socket.emit(SOCKET_EVENTS.fetchOldMsg, obj, (err: Error) => {
          if (err) {
            dispatch({ type: CHAT_ACTIONS.SET_LOAD_MORE })
            throw err
          }
          dispatch({ type: CHAT_ACTIONS.SET_PAGE })
        })
      } catch (err) {
        console.error(err)
      }
    },
    [loadMoreButton, dispatch, page]
  )

  const displayContent = React.useCallback(
    (el, text) => {
      if (el.isCoords) {
        return (
          <DisplayMapFC coords={JSON.parse(el.message)} isMobile={isMobile} />
        )
      }
      if (el.isUrl) {
        return (
          <a href={el.message} target="_blank" rel="noopener noreferrer">
            {el.message}
          </a>
        )
      }
      if (el.isImg) {
        return (
          <img
            src={el.message}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = () => {}
              (e.target as HTMLImageElement).src = BrokenImage
            }}
            width={sizeContainer}
            height="auto"
            alt={el.message}
          />
        )
      }
      if (el.isYTube) {
        return (
          <ReactPlayer
            url={el.message}
            width={sizeContainer}
            height={sizeContainer}
            loop
          />
        )
      }
      return <span>{text}</span>
    },
    [isMobile, sizeContainer]
  )

  const html = React.useMemo(
    () =>
      normalizedMsgs.map((el, idx) => {
        const keysColor = Object.keys(classes)
        const keyChosen = keysColor.filter((i) => i === el?.user?.avatarColor)
        const objChosen = keyChosen.map((i) => (classes as Record<string, string>)[i])[0]
        let textToHTML
        if (el.chat && !el.isUrl && !el.isCoords && !el.isImg && !el.isYTube) {
          textToHTML = EmojiReg(el.chat)
        }
        return (
          <div
            key={el._id + idx}
            className={
              user._id === el.user?.id ? 'message right' : 'message left'
            }
          >
            <div className="message__name">{el.user?.name}</div>
            <div className="data">
              <div className="avatar-name">
                <div className="content-msg">
                  {displayContent(el, textToHTML)}
                </div>
                <div className={classes.root}>
                  <Avatar
                    alt={el.user?.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = () => {}
                      (e.target as HTMLImageElement).src = DefaultAvatar
                    }}
                    className={objChosen}
                  />
                </div>
              </div>
              <div className="message_meta">
                {moment(el.createdAt).fromNow()}
              </div>
            </div>
          </div>
        )
      }),
    [normalizedMsgs, classes, user, displayContent]
  )

  const styles = {
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: isMobile ? ' 0 25%' : '0 40%',
    padding: '0 10px',
    height: '100px',
    borderRadius: '8px',
    border: '1px solid gray',
    backgroundColor: 'aliceblue'
  }

  if (!currentRoom && !isChoosingRoom) {
    return <div style={styles}>Please Choose a Room from the left sidebar!</div>
  }

  if (!normalizedMsgs?.length) {
    return <Loading styles={styles} isMobile={isMobile} />
  }

  return (
    <div>
      {normalizedMsgs?.length >= 21 && loadMoreButton && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <button onClick={loadMore} className="chat__loadMore">
            Load more
          </button>
        </div>
      )}
      {html}
      <div ref={divRef} />
    </div>
  )
}

export default React.memo(Messages)
