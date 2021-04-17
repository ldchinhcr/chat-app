const normalizeMessages = (messages = []) => {
    return messages.map((el) => {
        const user = el.user || el.username
        const chat = el.chat || el.message
        return {
            ...el,
            user,
            chat
        }
    })
}

export { normalizeMessages };
