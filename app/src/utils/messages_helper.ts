import { Message } from 'interfaces'

const normalizeMessages = (messages?: Message[]) => {
  return (messages || []).map((msg: Message) => {
    const user = msg.user || msg.username
    const chat = msg.chat || msg.message
    return {
      ...msg,
      user,
      chat
    }
  })
}

export { normalizeMessages }
