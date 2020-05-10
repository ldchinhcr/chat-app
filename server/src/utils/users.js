const users = [];
exports.addUser = ({id, username, chatroom}) => {
    username = username.trim();
    chatroom = chatroom.trim();

    if (!username || !chatroom) {
        return {
            error: 'Username and chatroom are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.chatroom === chatroom && user.username === username;
    })

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, chatroom }
    users.push(user);
    return {user}
}

exports.removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
};

exports.getUser = (id) => {
    return users.find((user) => user.id === id)
};

exports.getUsersInchatroom = (chatroom) => {
    chatroom = chatroom.trim().toLowerCase();
    return users.filter(user => user.chatroom === chatroom)
};