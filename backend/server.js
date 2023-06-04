const express = require('express')
const {chats} = require("./data/data")
const app = express()
const PORT = 5000




app.get('/', (req, res, next) =>{
    res.send(' API is running')
})

app.get("/api/chats", (req, res, next) =>{

res.send(chats)
})


app.get("/api/chats/:id", (req, res, next) =>{
console.log(req)
res.send(req.params)

    })

app.listen(PORT,console.log(`Server listening on port ${PORT}`))

