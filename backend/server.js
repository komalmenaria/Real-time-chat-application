const express = require('express')
const {chats} = require("./data/data")
const app = express()
const PORT = process.env.PORT || 5000





app.get('/', (req, res, next) =>{
    res.send(' API is running')
})

app.get("/api/chats", (req, res, next) =>{

res.send(chats)
})


app.get("/api/chats/:id", (req, res, next) =>{
const singleChat = chats.find((c)=>c._id === req.params.id)
res.send(singleChat)
    })


app.listen(PORT,console.log(`Server listening on port ${PORT}`))

