var app = require('express')();
var server = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});

var server = app.listen(3000, () => {
    console.log('listening on port 3000');
})

//socket
let io = require('socket.io').listen(server);
let secretCode;
let usersInChat = [];
let chatName;

io.on('connection', function (socket) {
    console.log('socket ' + socket.id + ' connected');

    socket.on('secretCode', (data) => {
        let userStarter = data.user;
        secretCode = data.secretCode;
        console.log('user ' + userStarter + ' started chat with code ' + secretCode);
    })

    socket.on('checkSecretCode', (data) => {

        if (data.submittedCode == secretCode) {
            socket.emit('codeValidated', { chatName: chatName });
        } else {
            socket.emit('codeDenied');
        }
    })

    socket.on('newUserJoined', (data) => {
        usersInChat.push(data.username);
        console.log('new user ' + data.username + ' has joined');
        let newUserName = data.username;
        io.emit('newUser', { username: newUserName });
    })

    socket.on('sendMessage', (data) => {
        io.emit('displayMessage', { username: data.username, msg: data.msg });
    })

    socket.on('chatName', (data) => {
        chatName = data.chatName;
    })

})