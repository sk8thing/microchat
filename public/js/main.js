const app = document.querySelector(".app")

const socket = io();

socket.on("error", () => {
    if(confirm("Your username contains illegal characters. Valid username only includes [a-zA-Z0-9_.]")){
        app.querySelector(".chat").classList.remove("active");
        app.querySelector(".join").classList.add("active");
    }
})

socket.on("userinfo", users => {
    print_users(users);
})

socket.on("messageinfo", messages => {
    if(messages.length === 0) return;
    messages.forEach((msg) =>{
        print_message(msg)
    })
})

socket.on("message", msg => {
    print_message(msg)
    app.querySelector(".chat .chat_window").scrollTop = app.querySelector(".chat .chat_window").scrollHeight;
})

app.querySelector(".join .join_form").addEventListener("submit", e => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    if(username.length === 0 || !username) return;
    socket.emit("join", username)
    app.querySelector(".join #username").value = "";
    app.querySelector(".join").classList.remove("active");
    app.querySelector(".chat").classList.add("active");
})

app.querySelector(".chat .chat_form").addEventListener("submit", e => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    if(message.length === 0 || message.length > 255) return;
    socket.emit("message", message);
    app.querySelector(".chat #message").value = "";
})

print_message = msg => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="text">${msg.text}</p>
    <p class="meta">${msg.username}@<span>${msg.time}</span></p>`;
    app.querySelector(".chat .chat_window").appendChild(div)
}

print_users = users => {
    app.querySelector(".chat #users").innerHTML = "";
    users.forEach(user => {
        const list = document.createElement("li");
        list.innerText = user;
        app.querySelector(".chat #users").appendChild(list);
    })
}