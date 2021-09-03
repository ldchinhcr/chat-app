export interface User {
    _id: string
    name: string
    sid: string
    chatroom: ChatRoom
    active: boolean
    avatarColor?: string
    createdAt?: string
    updatedAt?: string
}

export interface Message {
    _id: string
    isCoords: boolean
    isUrl?: boolean
    chatroom: ChatRoom
    isImg?: boolean
    isYTube?: boolean
    username?: Partial<User & {
        id: string
    }>
    user?: Partial<User & {
        id: string
    }>
    message?: string
    chat?: string
    createdAt?: string
    updatedAt?: string
}

export interface ChatRoom {
    _id: string
    chatroom: string
    username?: User[]
    createdAt?: string
    updatedAt?: string
}