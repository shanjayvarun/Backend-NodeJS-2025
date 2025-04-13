const socket = io('http://localhost:3000')

const form = document.querySelector('.msg-form')
const formContainer = document.querySelector('.form-container')
const messageInput = document.querySelector('.msg-input')

const user = prompt('Enter a username you wanna Chat?')
addMessage('You joined the chat!', 'first-message')
socket.emit('new-user', user)

socket.on('receive-message', data => {
    addMessage(`${data.message}`, 'received');
})

form.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    addMessage(`${message}`, 'sent');
    socket.emit('send-message', message)
    messageInput.value = ''
})

function addMessage(message, type = 'received', avatarUrl = 'https://i.pravatar.cc/30') {
    const messageWrapper = document.createElement('div');
    messageWrapper.style.display = 'flex';
    messageWrapper.style.alignItems = 'center';
    messageWrapper.style.margin = '5px 0';
    messageWrapper.style.justifyContent = type === 'sent' ? 'flex-end' : 'flex-start';

    const avatar = document.createElement('img');
    avatar.src = avatarUrl;
    avatar.alt = 'avatar';
    avatar.style.width = '30px';
    avatar.style.height = '30px';
    avatar.style.borderRadius = '50%';
    avatar.style.marginRight = type === 'sent' ? '0' : '10px';
    avatar.style.marginLeft = type === 'sent' ? '10px' : '0';

    const messageBubble = document.createElement('div');
    messageBubble.style.backgroundColor = type === 'sent' ? '#d1ffd1' : '#d1e0ff';
    messageBubble.style.padding = '6px 10px';
    messageBubble.style.borderRadius = '8px';
    messageBubble.style.maxWidth = '70%';

    const text = document.createElement('p');
    text.innerText = message;
    text.style.margin = '0';

    const timestamp = document.createElement('small');
    timestamp.innerText = new Date().toLocaleTimeString();
    timestamp.style.fontSize = '10px';
    timestamp.style.color = '#555';

    messageBubble.appendChild(text);
    messageBubble.appendChild(timestamp);

    if (type === 'sent') {
        messageWrapper.appendChild(messageBubble);
        messageWrapper.appendChild(avatar);
    }
   else {
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageBubble);
    }

    formContainer.appendChild(messageWrapper);
}
