console.log("Hello World!")

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
require("dotenv").config()
const User = require("./user")
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: 'http://127.0.0.1:5502', // Permita esta origem
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
//const port = 3000

app.listen(port, ()=> {
    console.log(`Servidor rodando na Porta ${port}`)
})

require("./connection")  

const mongoose = require('mongoose');

// Definição do esquema de Postagem (Post)
const PostSchema = new mongoose.Schema({
    assunto: { type: String, required: true },
    conteudo: { type: String, required: true },
    data: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

// Rota para criar uma nova postagem
app.post('/posts', async (req, res) => {
    try {
        const { assunto, conteudo } = req.body;
        
        // Cria um novo post com a data atual
        const newPost = new Post({
            assunto,
            conteudo,
            data: Date.now()  // Gera a data e hora atual em milissegundos
        });

        console.log('Novo post criado');
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// axios.post('http://127.0.0.1:3000/posts', {
//     assunto: "",
//     conteudo: ""
// })
// .then(response => console.log(response.data))
// .catch(error => console.error(error));

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });  // Ordena por data, da mais recente para a mais antiga
        res.json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});