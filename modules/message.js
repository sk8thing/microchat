const queue = [];
const moment = require("moment");

obj_from_message = (username, text) => {
    return {
        username,
        text,
        time: moment().format("h:mm A")
    }
}

message_queue_push = (message) =>{
    if(queue.length > 20) queue.pop();
    queue.push(message);
}

get_message_queue = () => {
    return queue;
}


module.exports = {
    obj_from_message,
    message_queue_push,
    get_message_queue
}