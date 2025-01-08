// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io with the server
const io = socketIo(server);

// Store user connections
let users = {};

// Serve static files (index.html)
app.use(express.static('public'));

// WebSocket event handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store the user's socket id
    users[socket.id] = {
        id: socket.id,
        name: `User ${socket.id}` // Default name
    };

    // Broadcast when a new user joins
    io.emit('chat message', `User ${socket.id} has joined the chat`);

    // Listen for messages from the client
    socket.on('chat message', (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        
        // Broadcast the message to all connected clients
        io.emit('chat message', `${users[socket.id].name}: ${msg}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
        io.emit('chat message', `User ${socket.id} has left the chat`);
    });
});

// Start the server on port 3000
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
