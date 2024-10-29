console.log("Hello World!")

const express = require("express")
const cors = require("cors")

require("dotenv").config()

var app = express()

app.use(cors())

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Servidor rodando na Porta ${port}`)
})

require("./connection") 