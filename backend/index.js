const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
//Socket.io 
// Initialize socket.io server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
//server.listen(5000);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

require("dotenv").config();

// Running The Server
const PORT = process.env.PORT || 4000;
// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));



// Protect routes
const { authenticate} = require('./config/ProtectRoutes');

// mongoose Database
const connectToDB = require("./config/db");
// Connection To Database
connectToDB();
// auto refresh
require("./config/autoRefresh");


app.get('/protected', authenticate, (req, res) => {
  //console.log("req.verified : ");
  //console.log(req.verified);
  return res.status(200).json({ message: 'Protected resource accessed', user: req.verified, isAuthenticated:true });
}); 


app.get('/', (req, res) => {
  res.send('Hello World   !')
})


app.use("/auth", require("./routes/authRoute"));
app.use("/api", require("./routes/userRoute"));
app.use("/product", require("./routes/productRoute"));
app.use("/settings", require("./routes/settingsRoute"));
app.use("/chat", require("./routes/chatRoute"));
app.use("/form", require("./routes/formRoute"));
app.use("/notifications", require("./routes/notificationRoute"));
app.use("/statistics", require("./routes/homeRoute"));



// Store connected users
let connectedUsers = {};
// Endpoint to check if a user is connected
app.get('/check_user_status/:userId', (req, res) => {
  const userId = req.params.userId;
  const isConnected = connectedUsers.hasOwnProperty(userId);
  //console.log("userId :" + userId + "\n" + "isConnected :" + isConnected);
  return res.json({ isConnected });
});

//const Message = require('./models/Message');
io.on('connection', (socket) => {
  //console.log('New client connected');

  socket.on('user_connected', (userId) => {
    connectedUsers[userId] = socket.id;
    io.emit('update_users', Object.keys(connectedUsers)); // Notify all clients
  });

  socket.on('user_disconnected', (userId) => {
    delete connectedUsers[userId];
    io.emit('update_users', Object.keys(connectedUsers)); // Notify all clients
  });
  socket.on('disconnect', () => {
    //console.log('Client disconnected');
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        io.emit('update_users', Object.keys(connectedUsers)); // Notify all clients
        break;
      }
    }
  });

  socket.on('check_user_status', (userId, callback) => {
    const isConnected = Boolean(connectedUsers[userId]);
    callback(isConnected);
  });


  socket.on('sendMessage', async (message) => {
/*     try {
      //const newMessage = new Message(message);
      const newMessage = new Message({ ...message, read: false });
      await newMessage.save(); */
      io.emit('message', message); // Broadcast message to all clients    newMessage
/*     } catch (error) {
      console.error('Error saving message:', error);
    } */
  });





});



server.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
