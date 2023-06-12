const express = require('express')
const {chats} = require("./data/data")
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
const { notFound , errorHandler} = require("./middlewares/errorMiddleware")
dotenv.config()

connectDB()

app.use(express.json());
app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) =>{
    res.send(' API is running')
})
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use(notFound)
app.use(errorHandler)




const server = app.listen(PORT,console.log(`Server listening on port ${PORT}`))
const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    }
})

io.on("connection" , (socket)=>{
console.log("Connected to   socket.io") 
})

