const express = require('express')
const { chats } = require("./data/data")
const dotenv = require('dotenv')
const app = express()
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const bodyParser = require('body-parser')
const fileUpload = require("express-fileupload");
var cors = require('cors')
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
dotenv.config()

connectDB()

app.use(express.json());
app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.send(' API is running')
})
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use(notFound)
app.use(errorHandler)




const server = app.listen(PORT, console.log(`Server listening on port ${PORT}`))
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })

    })

    socket.off("setup" , ()=>{
        console.log("USER disconnected");
        socket.leave(userData._id);
    })
})

