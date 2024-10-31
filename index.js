console.log("Hello World!")

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
require("dotenv").config()
const User = require("./user")

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Permita esta origem
    credentials: true // Permite que cookies sejam enviados
}

app.use(cors(corsOptions))

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword })
    try {
        await user.save()
        res.status(201).send('Usuário criado')
    } catch (error) {
        res.status(400).send('Erro ao criar usuário: ' + error.message)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    console.log("Login realizado com Sucesso")
    const user = await User.findOne({ username })
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })
        res.cookie('token', token, { httpOnly: true })
        res.send('Login bem-sucedido')
    } else {
        res.status(401).send('Credenciais inválidas')
    }
})

app.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.send('Logout bem-sucedido')
})

const port = process.env.PORT || 3000

app.listen(port, ()=> {
    console.log(`Servidor rodando na Porta ${port}`)
})

require("./connection")  