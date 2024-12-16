const socket = io('http://localhost:8000');

const form = document.getElementById('message-bar-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container1");


const name = prompt("Enter your name to continue the chat");
if (name) {
    socket.emit('new-user-joined', name);
} else {
    // Optional: Handle case where user cancels the prompt
    alert("You must enter a name to join the chat!");
}


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); // 'right' for sender, 'left' for receiver
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
};

socket.on('user-joined', name => {
    console.log(`Received user-joined event for ${name}`);
    append(`${name} joined the chat`, 'left');
});

// When user receives a message, it'll appear on the left
socket.on('receive', (data) => {
    console.log('Received message:', data.message); // Debugging line
    append(`${data.name}: ${data.message}`, 'left'); // Display the received message
});

// Code which would listen to the disconnect event 
socket.on('left', name => {
    console.log(`Received 'left' event for ${name}`);  // Log the event
    append(`${name} left the chat`, 'left');
});

// If the server sends message history, display it as 'left' by default
socket.on('message-history', (messages) => {
    messages.forEach((data) => {
        if (data.name === name) {
            append(`You: ${data.message}`, 'right'); // Your messages on the right
        } else {
            append(`${data.name}: ${data.message}`, 'left'); // Others' messages on the left
        }
    });
});

// When the user sends a message, emit the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page
    const message = messageInput.value;  // Get the message from the input
    append(`You: ${message}`, 'right');  // Append your own message to the chat window
    socket.emit('send', message);  // Send the message to the server
    messageInput.value = '';  // Clear the input field after sending
});
