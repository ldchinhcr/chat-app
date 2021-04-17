const SOCKET_EVENTS = {
    fetchRoom: 'fetchRoom',
    allRoom: 'allRoom',
    selectedRoom: 'selectedRoom',
    leaveRoom: 'leaveRoom',
    setUser: 'setUser',
    messages: 'messages',
    oldmessages: 'oldmessages',
    join: 'join',
    sendInputMsg: 'sendInputMsg',
    sendLocation: 'sendLocation',
    fetchOldMsg: 'fetchOldMsg',
}

const USER_LOCAL_STORAGE_KEY = 'user'

export { SOCKET_EVENTS, USER_LOCAL_STORAGE_KEY }
