const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (MongoDB)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realtime-chat';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Message Model
const Message = require('./models/Message');

// Store active users
const activeUsers = new Map();

// Socket.IO Connection Events
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join event: User joins the chat
  socket.on('user-join', async (username) => {
    // Store user info
    activeUsers.set(socket.id, {
      id: socket.id,
      username: username,
      joinedAt: new Date()
    });

    console.log(`[User Join] ${username} joined the chat. Active users: ${activeUsers.size}`);

    // Broadcast updated user list to all clients
    const userList = Array.from(activeUsers.values()).map(user => ({
      id: user.id,
      username: user.username
    }));
    io.emit('user-list', userList);

    // Send previously stored messages to the new user
    try {
      const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
      socket.emit('message-history', messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
    }

    // Notify all users that someone joined
    io.emit('notification', {
      type: 'user-joined',
      username: username,
      timestamp: new Date()
    });
  });

  // Message event: Broadcast message to all clients
  socket.on('send-message', async (data) => {
    const { message, username } = data;

    if (!message.trim()) return;

    const messageData = {
      sender: username,
      text: message,
      timestamp: new Date(),
      userId: socket.id
    };

    // Save message to database
    try {
      const newMessage = await Message.create(messageData);
      console.log(`[Message] ${username}: ${message}`);

      // Broadcast message to all connected clients
      io.emit('receive-message', {
        _id: newMessage._id,
        sender: newMessage.sender,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        userId: newMessage.userId
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to save message' });
    }
  });

  // Typing indicator
  socket.on('user-typing', (username) => {
    socket.broadcast.emit('user-typing', username);
  });

  socket.on('user-stop-typing', (username) => {
    socket.broadcast.emit('user-stop-typing', username);
  });

  // Disconnect event: User leaves the chat
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      console.log(`[User Disconnect] ${user.username} left the chat. Active users: ${activeUsers.size}`);

      // Update user list for remaining users
      const userList = Array.from(activeUsers.values()).map(u => ({
        id: u.id,
        username: u.username
      }));
      io.emit('user-list', userList);

      // Notify all users about the disconnection
      io.emit('notification', {
        type: 'user-left',
        username: user.username,
        timestamp: new Date()
      });
    }
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`[Socket Error] ${socket.id}:`, error);
  });
});

// HTTP Routes
app.get('/', (req, res) => {
  res.send('Real-Time Chat Server is running');
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
