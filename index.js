const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { obj_from_message, get_message_queue, message_queue_push } = require("./modules/message");
const { add_user, remove_user, get_user, get_users } = require("./modules/users");

const bot_name = "\u03BCBot"
const regex = /^[a-zA-Z0-9_.]/;
const io = new Server(server);
const PORT = process.argv[2] || process.env.PORT || 80

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
    socket.on("join", username => {
        if(!regex.test(username)){
            socket.emit("error");
            return
        }
        add_user(socket.id, username)
        socket.join("main");
        socket.emit("messageinfo", get_message_queue());
        socket.emit("message", obj_from_message(bot_name, "You joined the chat!"));
        socket.broadcast.to("main").emit("message", obj_from_message(bot_name, `${username} has joined!`));
        io.to("main").emit("userinfo", get_users());
    })
    socket.on("message", msg => {
        if(msg.length < 1 || msg.length > 255 || !get_user(socket.id)) return;
        message_queue_push(obj_from_message(get_user(socket.id), msg));
        io.to("main").emit("message", obj_from_message(get_user(socket.id), msg))
    })
    socket.once("disconnect", () => {
        const user = get_user(socket.id)
        if(!user) return;
        io.to("main").emit("message", obj_from_message(bot_name, `${user} has left!`))
        remove_user(socket.id)
        io.to("main").emit("userinfo", get_users())
    })
});

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
});
