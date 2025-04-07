const socket = io('http://localhost:3000')

const form = document.querySelector('.msg-form')
const formContainer = document.querySelector('.form-container')
const messageInput = document.querySelector('.msg-input')

const user = prompt('Enter a username you wanna Chat?')
addMessage('You joined the chat!')
socket.emit('new-user', user)

socket.on('receive-message', data => {
    console.log('📩 Message from server:', data);
    addMessage(`${data.user.clientName}: ${data.message}`)   
})

form.addEventListener('submit', e=> {
    e.preventDefault()                       
    const message = messageInput.value  
    addMessage(`You: ${message}`)
    socket.emit('send-message', message)     
    messageInput.value = ''       
})
 
function addMessage(message){  
    const displayedMessage = document.createElement('p')   
    displayedMessage.innerText = message   
    formContainer.append(displayedMessage)  
}