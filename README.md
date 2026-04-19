# Real-Time Chat Application

A full-stack real-time chat application built with WebSockets, featuring persistent message history and online user management.

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** with **Mongoose** - NoSQL database for message persistence
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Socket.io-client** - Socket.io client library

## Features

✅ **Real-time Messaging** - Messages broadcast to all connected clients instantly  
✅ **Message Persistence** - All messages saved to MongoDB with timestamps  
✅ **Online Users List** - Dynamic sidebar showing active users  
✅ **Join Screen** - Username input before joining chat  
✅ **Auto-scroll** - Automatically scrolls to latest messages  
✅ **Typing Indicator** - Shows when other users are typing  
✅ **Message History** - Loads previous messages when joining  
✅ **User Notifications** - Alerts when users join/leave  

## Project Structure

```
Real-time Chat App/
├── backend/
│   ├── models/
│   │   └── Message.js          # Mongoose message schema
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Main server file with Socket.io logic
│   └── .env                    # Environment variables
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Chat.jsx        # Main chat component
    │   ├── App.jsx             # Root component
    │   ├── index.jsx           # Entry point
    │   └── index.css           # Global styles
    ├── index.html              # HTML template
    ├── package.json            # Frontend dependencies
    ├── vite.config.js          # Vite configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    └── postcss.config.js       # PostCSS configuration
```

## Socket.IO Events

### Server Events (Emitted by Backend)

| Event | Description | Data |
|-------|-------------|------|
| `message-history` | Sends previous messages to new users | Array of messages |
| `receive-message` | Broadcasts new message to all clients | `{sender, text, timestamp, userId}` |
| `user-list` | Updates list of online users | Array of user objects |
| `user-typing` | Indicates user is typing | Username |
| `user-stop-typing` | Indicates user stopped typing | Username |
| `notification` | User joined/left notifications | `{type, username, timestamp}` |

### Client Events (Sent by Frontend)

| Event | Description | Data |
|-------|-------------|------|
| `user-join` | User joins chat | Username |
| `send-message` | User sends message | `{message, username}` |
| `user-typing` | User starts typing | Username |
| `user-stop-typing` | User stops typing | Username |

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas URI)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Update `.env` file with your MongoDB URI
   - Default: `mongodb://localhost:27017/realtime-chat`

4. **Start the server:**
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:3000`

## Key Components

### Chat Component (`Chat.jsx`)
The main component handling:
- Socket connection initialization
- User joining with username
- Message sending and receiving
- Typing indicators
- Auto-scroll to latest messages
- User list updates
- Disconnect handling

**Props:** None (uses Socket.io directly)

**State:**
- `socket` - Socket.io instance
- `username` - Current user's username
- `isJoined` - Whether user has joined chat
- `messages` - Array of all messages
- `messageInput` - Current message input
- `onlineUsers` - List of connected users
- `typingUser` - Currently typing user

### Server Events Handler
The server.js file includes:

**Connection Event:**
```javascript
io.on('connection', (socket) => {
  // Logs user join
  // Stores user info
  // Sends message history
  // Broadcasts user list
});
```

**Message Event:**
```javascript
socket.on('send-message', async (data) => {
  // Saves to MongoDB
  // Broadcasts to all clients
});
```

**Disconnect Event:**
```javascript
socket.on('disconnect', () => {
  // Removes user from active list
  // Updates online users list
});
```

## Database Schema

### Message Schema (MongoDB)
```javascript
{
  sender: String,        // Username of sender
  text: String,          // Message content
  userId: String,        // Socket ID of sender
  timestamp: Date,       // Message timestamp
  createdAt: Date,       // Document creation time
  updatedAt: Date        // Document update time
}
```

## Future Enhancements

- [ ] Private messaging between users
- [ ] User authentication (JWT)
- [ ] Message reactions/emojis
- [ ] File/image sharing
- [ ] Chat rooms/channels
- [ ] User profiles
- [ ] Message search functionality
- [ ] Read receipts
- [ ] Message editing/deletion

## Troubleshooting

### Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify MongoDB connection string

### Messages Not Persisting
- Check MongoDB connection
- Ensure Mongoose model is properly initialized
- Check server logs for database errors

### Real-time Updates Not Working
- Verify Socket.io client version matches server
- Check browser console for socket errors
- Ensure CORS is properly configured

## License

MIT
