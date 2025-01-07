
const nameText = document.getElementById("name");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const date = new Date();
const socket = io();
//allCookies = document.cookie;

let allMessages = []

setInterval(renderMessages, 1000)

console.log(document.cookie)

getName()

async function getName() {
    try {
        const response = await fetch("/message/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            }, body: 
                JSON.stringify({cookie: `${document.cookie}`})
        });
        if (!response.ok) { 
            throw new Error('Network response was not ok'); 
        }
        const result = await response.json()
        nameText.innerText = result.name;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

}

async function sendMessage() {
    try {
        if (messageInput.value === "") return
        
        const response = await fetch("/api/send/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body:
            JSON.stringify({
                message: `${messageInput.value}`,
                cookie: `${document.cookie}`
            })
        })
        console.log("hello")
        const result = await response.json()
        console.log(result)
        
        messages.scrollTop = 0
        renderMessages()
        messageInput.value = ""
    } catch (error) {
        console.error("error sending message:", error)
    }
}

async function renderMessages() {
    const response = await fetch("/api/getmsgs")
    allMessages = await response.json();
    messages.innerHTML = '';
    allMessages.map((message) => {
        const msgId = `${document.cookie}-${date.now}-${message.message}`
        const msgElement = document.createElement('p'); 
        msgElement.id = msgId; 
        const cookie = document.cookie;
        const id = cookie.substring(cookie.length - 100);
        if (message.id === id) {
            msgElement.classList.add("myMessage")
        } else {
            msgElement.classList.add("otherMessage")
        }
        msgElement.textContent = message.message; 
        messages.insertAdjacentElement('afterbegin', msgElement);
        
    })
}

messageInput.addEventListener("keydown", (e) => {
    if ( e.key === "Enter") {
        sendMessage()
    }
})

socket.on('newMessage', (data) => { 
    renderMessages(); // Re-render messages when a new message is received 
});

document.addEventListener("DOMContentLoaded", renderMessages)

