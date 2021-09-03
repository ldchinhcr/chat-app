import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Dispatch
} from 'react'
import Content from 'components/Content'
import Sidebar from 'components/Sidebar'
import { makeStyles } from '@material-ui/core/styles'
import { connect, RootStateOrAny } from 'react-redux'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import socket from 'socket'
import { SOCKET_EVENTS } from '../constants'
import Button from '@material-ui/core/Button'
import NavigationIcon from '@material-ui/icons/Navigation'
import { Smile } from 'react-feather'
import data from 'emoji-mart/data/facebook.json'
import {
  NimblePicker,
  NimbleEmojiIndex,
  BaseEmoji,
  Data
} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete'
import { getByNative } from 'utils/regexCheckEmoji'
import CssBaseline from '@material-ui/core/CssBaseline'
import cx from 'classnames'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { useReactResponsive } from 'hooks'
import { ChatRoom, Message, User } from 'interfaces'
import { createRef } from 'react'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  }
}))

export interface ChatProps extends RouteComponentProps {
  user: User
  page: number
  messages?: Array<Message>
  loadMoreButton?: boolean
  room?: Array<ChatRoom>
  currentRoom?: ChatRoom
}

const Chat: React.FC<ChatProps> = (props) => {
  // @ts-ignore
  const classes = useStyles()
  const sidebarRef = createRef<HTMLDivElement>()
  const { user } = props
  const [isRequesting, setIsRequesting] = useState(false)
  const [isHoldingShift, setIsHoldingShift] = useState(false)
  const [isChoosingRoom, setIsChoosingRoom] = useState(false)
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const history = useHistory()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { isDesktop, isTablet, isMobile } = useReactResponsive()
  const pageProps = {
    ...props,
    isChoosingRoom,
    setIsChoosingRoom,
    setIsCollapsed
  }
  // @ts-ignore
  const emojiIndex = useMemo(() => new NimbleEmojiIndex(data as Data), [])

  const setHoldingShift = useCallback((e) => {
    if (e.key === 'Shift') {
      setIsHoldingShift(true)
    }
  }, [])

  const unSetHoldingShift = useCallback(
    (e) => {
      if (e.key === 'Shift' && isHoldingShift) {
        setIsHoldingShift(false)
      }
    },
    [isHoldingShift]
  )

  const clickOutsideSidebar = useCallback(
    (ev: MouseEvent): void => {
      const actionElement = sidebarRef.current
      const clickOnAction =
        actionElement &&
        (ev.target === actionElement ||
          actionElement.contains(ev.target as HTMLElement))

      if (!clickOnAction && !isCollapsed) {
        setIsCollapsed(true)
      }
    },
    [isCollapsed, sidebarRef]
  )

  useEffect(() => {
    window.addEventListener('keydown', setHoldingShift)
    return () => window.removeEventListener('keydown', setHoldingShift)
  }, [setHoldingShift])

  useEffect(() => {
    window.addEventListener('keyup', unSetHoldingShift)
    return () => window.removeEventListener('keyup', unSetHoldingShift)
  }, [unSetHoldingShift])

  useEffect(() => {
    window.addEventListener('click', clickOutsideSidebar)
    return () => window.removeEventListener('click', clickOutsideSidebar)
  }, [clickOutsideSidebar])

  const onChange = useCallback(
    (e) => {
      const emoji = getByNative(e.target.value)
      if (emoji) {
        setInput((emoji as BaseEmoji).native)
      } else {
        setInput(e.target.value)
      }
    },
    [setInput]
  )

  const onHandleSubmit = useCallback(async () => {
    setIsRequesting(true)
    const obj = {
      user: { id: user._id, name: user.name },
      message: input,
      chatroom: user.chatroom._id,
      sid: user.sid
    }
    try {
      await socket.emit(SOCKET_EVENTS.sendInputMsg, obj, (err: Error) => {
        if (err) {
          throw err
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      setInput('')
      setIsRequesting(false)
    }
  }, [user, input])

  const onSendLocation = useCallback(
    (e) => {
      e.preventDefault()
      setIsRequesting(true)
      if (!navigator.geolocation) {
        alert('Your browser not support send location')
        setIsRequesting(false)
        return
      }
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const coords = JSON.stringify({
            lati: position.coords.latitude,
            long: position.coords.longitude
          })
          const obj = {
            user: { id: user._id, name: user.name },
            message: coords,
            chatroom: user.chatroom._id,
            sid: user.sid
          }
          await socket.emit(SOCKET_EVENTS.sendLocation, obj, (err: Error) => {
            if (err) {
              throw err
            }
          })
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsRequesting(false)
        setInput('')
      }
    },
    [user]
  )

  const onToggleCollapsible = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsCollapsed(!isCollapsed)
    },
    [isCollapsed]
  )

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker)
  }, [showEmojiPicker])

  const handleKeyPress = useCallback(
    (event) => {
      if (!isHoldingShift && event.key === 'Enter') {
        event.preventDefault()
        onHandleSubmit()
      }
    },
    [onHandleSubmit, isHoldingShift]
  )

  const addEmoji = useCallback(
    (emoji) => {
      const text = `${input}${emoji.native}`
      setInput(text)
      setShowEmojiPicker(false)
    },
    [input]
  )

  const triggerConfig = useMemo(
    () => ({
      ':': {
        dataProvider: (token: string) =>
          emojiIndex.search(token)?.map((o) => ({
            name: o.name,
            native: (o as BaseEmoji).native
          })),
        component: ({
          entity: { native, name }
        }: {
          entity: { native: string; name: string }
        }) => <div>{`${name} ${native}`}</div>,
        output: (item: BaseEmoji) => `${item.native}`
      }
    }),
    [emojiIndex]
  )

  if (!user) {
    return (
      <div className="img-cover" style={{ overflow: 'hidden' }}>
        <Button
          variant="contained"
          onClick={() => {
            history.push('/')
          }}
        >
          Click here redirect to Login Page
        </Button>
      </div>
    )
  }

  return (
    <div className="chat">
      <CssBaseline />
      {isDesktop || isTablet ? (
        <Sidebar {...pageProps} />
      ) : (
        <div
          className={cx('collapsible-sidebar', { collapsed: isCollapsed })}
          ref={sidebarRef}
        >
          <span className="collapsible-icon" onClick={onToggleCollapsible}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </span>
          <Sidebar {...pageProps} />
        </div>
      )}
      <div className={cx('chat__main', { 'mobile-view': isMobile })}>
        <Content {...pageProps} />
        {showEmojiPicker && (
          <NimblePicker
            set="facebook"
            title="Pick an icon"
            // @ts-ignore
            data={data as Data}
            onSelect={addEmoji}
          />
        )}
        <div className="compose">
          <Button
            color="primary"
            className={classes.button}
            onClick={onSendLocation}
            disabled={isRequesting}
          >
            <NavigationIcon />
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
              disabled={isRequesting}
              placeholder="Hit Enter to send, Shift + Enter to break line"
              required
              // @ts-ignore
              trigger={triggerConfig}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootStateOrAny) => {
  return {
    page: state.page,
    messages: state.messages,
    loadMoreButton: state.loadMore,
    user: state.user,
    room: state.room,
    currentRoom: state.currentRoom
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
