const socket = io()

//////////////////////////////////////
//de prueba:                         /
// Swal.fire({
//     title: 'saludos',             /
//     text: 'mensaje inicial',
//     icon: 'success'
// })                                /

//////////////////////////////////////


let user
const chatBox = document.getElementById('chatBox')
const messagesLog = document.getElementById('messageLogs')

Swal.fire({
    title: "identificate",
    input: 'text', 
    text: 'ingresa el usuario para identificarte en el chat',
    inputValidator: (value) => {
        return !value && 'necesitas escribir un nombre de usuario para usar el chat'
    },
    allowOutsideClick: false, 
    allowEscapeKey: false

}).then((result) => {
    user = result.value
    socket.emit('authenticated', user);
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key ==='Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message' , {user, message: chatBox.value})
            chatBox.value='';
        }
    }
})

socket.on('messageLogs', data => {
    let messages = ''
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message} <br/>`
    });
    messagesLog.innerHTML=messages;
})

socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000, 
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})