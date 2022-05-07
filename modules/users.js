const { HashMap } = require('hashmap')
const users = new HashMap();

add_user = (id, username) => {
    if(Array.from(users.values()).includes(username)){
        do {
            username = username.concat("*")
        } while(Array.from(users.values()).includes(username));
    }
    users.set(id, username);
}

remove_user = id => {
    users.delete(id);
}

get_user = id => {
    return users.get(id);
}

get_users = () => {
    return Array.from(users.values())
}

module.exports = {
    add_user,
    remove_user,
    get_user,
    get_users
}