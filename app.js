// Express initializes app to be a function handler that you can supply to an HTTP server (as seen in line 4).
// We define a route handler / that gets called when we hit our website home.
// We make the http server listen on port 3000.

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3200;

// Notice that I initialize a new instance of socket.io by passing the server (the HTTP server) object. Then I listen on the 
// connection event for incoming sockets and log it to the console.
const { Server } = require("socket.io");
;
// Add socket.io
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

// Our code would look very confusing if we just placed our entire application’s HTML there, so instead we’re going to create a index.html file and serve that instead.
// Let’s refactor our route handler to use sendFile instead.
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

//Connect socket
io.on('connection', (socket) => {
    const chatName = JSON.parse(JSON.stringify(socket.handshake.query))
    console.log('A user connected!', chatName.name);

    //Disconnect socket
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    //Chat message event
    socket.on('to_server_message', (msg) => {
        console.log('From', chatName.name, ':', msg)
        io.emit('to_client_message', {
            name: chatName.name,
            message: msg
        });
    });

    //Save Updates
    socket.on('pushUpdates', (data) => {
        console.log('Pushing content updates');
        io.emit('buttonUpdate', data)
    })
});
//In order to send an event to everyone, Socket.IO gives us the io.emit() method.


// PORT
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});