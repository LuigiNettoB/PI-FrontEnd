<<<<<<< HEAD
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

const visitaSchema = new mongoose.Schema({
    visitas: { type: Number, default: 0 }
});

const Visita = mongoose.model('Visita', visitaSchema);

// Rota para incrementar as visitas
app.get('/incrementar-visita', async (req, res) => {
    try {
        // Encontrar o contador de visitas
        const visita = await Visita.findOne();
        
        if (!visita) {
            // Se não existir o contador, cria um com 0 visitas
            const novoContador = new Visita({ visitas: 1 });
            await novoContador.save();
            return res.json({ visitas: 1 });
        }
        
        // Se já existir, incrementa o contador de visitas
        visita.visitas += 1;
        await visita.save();
        res.json({ visitas: visita.visitas });
    } catch (err) {
        console.error('Erro ao incrementar visita:', err);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para obter o número de visitas
app.get('/get-visitas', async (req, res) => {
    try {
        const visita = await Visita.findOne();
        if (visita) {
            return res.json({ visitas: visita.visitas });
        }
        res.json({ visitas: 0 });
    } catch (err) {
        console.error('Erro ao obter visitas:', err);
        res.status(500).send('Erro no servidor');
    }
});

const cliqueSchema = new mongoose.Schema({
    cliques: { type: Number, default: 0 }
  });
  
  const Clique = mongoose.model('Clique', cliqueSchema);
  

app.post('/incrementar-clique', async (req, res) => {
    try {
      let clique = await Clique.findOne();
      if (!clique) {
        clique = new Clique({ cliques: 1 });
        await clique.save();
      } else {
        clique.cliques += 1;
        await clique.save();
      }
      res.json({ cliques: clique.cliques });
    } catch (err) {
      console.error('Erro ao incrementar cliques:', err);
      res.status(500).send('Erro no servidor');
    }
  });
  

  app.get('/get-cliques', async (req, res) => {
    try {
      const clique = await Clique.findOne();
      if (clique) {
        return res.json({ cliques: clique.cliques });
      }
      res.json({ cliques: 0 });
    } catch (err) {
      console.error('Erro ao obter cliques:', err);
      res.status(500).send('Erro no servidor');
    }
  });

  const enderecoSchema = new mongoose.Schema({
    endereco: { type: String, required: true }
  });
  
  const Endereco = mongoose.model('Endereco', enderecoSchema);
  
  // Rota para salvar o endereço
  app.post('/salvar-endereco', async (req, res) => {
    try {
      const { endereco } = req.body;
      const novoEndereco = new Endereco({ endereco });
      await novoEndereco.save();
      res.status(201).json({ message: 'Endereço salvo com sucesso!', endereco });
    } catch (err) {
      console.error('Erro ao salvar endereço:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });
  
  // Rota para obter o endereço
  app.get('/obter-endereco', async (req, res) => {
    try {
      const endereco = await Endereco.findOne().sort({ _id: -1 }); // Obtém o último endereço salvo
      if (endereco) {
        return res.json({ endereco: endereco.endereco });
      }
      res.status(404).json({ message: 'Nenhum endereço encontrado' });
    } catch (err) {
      console.error('Erro ao obter endereço:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });
=======
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

const visitaSchema = new mongoose.Schema({
    visitas: { type: Number, default: 0 }
});

const Visita = mongoose.model('Visita', visitaSchema);

// Rota para incrementar as visitas
app.get('/incrementar-visita', async (req, res) => {
    try {
        // Encontrar o contador de visitas
        const visita = await Visita.findOne();
        
        if (!visita) {
            // Se não existir o contador, cria um com 0 visitas
            const novoContador = new Visita({ visitas: 1 });
            await novoContador.save();
            return res.json({ visitas: 1 });
        }
        
        // Se já existir, incrementa o contador de visitas
        visita.visitas += 1;
        await visita.save();
        res.json({ visitas: visita.visitas });
    } catch (err) {
        console.error('Erro ao incrementar visita:', err);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para obter o número de visitas
app.get('/get-visitas', async (req, res) => {
    try {
        const visita = await Visita.findOne();
        if (visita) {
            return res.json({ visitas: visita.visitas });
        }
        res.json({ visitas: 0 });
    } catch (err) {
        console.error('Erro ao obter visitas:', err);
        res.status(500).send('Erro no servidor');
    }
});

const cliqueSchema = new mongoose.Schema({
    cliques: { type: Number, default: 0 }
  });
  
  const Clique = mongoose.model('Clique', cliqueSchema);
  

app.post('/incrementar-clique', async (req, res) => {
    try {
      let clique = await Clique.findOne();
      if (!clique) {
        clique = new Clique({ cliques: 1 });
        await clique.save();
      } else {
        clique.cliques += 1;
        await clique.save();
      }
      res.json({ cliques: clique.cliques });
    } catch (err) {
      console.error('Erro ao incrementar cliques:', err);
      res.status(500).send('Erro no servidor');
    }
  });
  

  app.get('/get-cliques', async (req, res) => {
    try {
      const clique = await Clique.findOne();
      if (clique) {
        return res.json({ cliques: clique.cliques });
      }
      res.json({ cliques: 0 });
    } catch (err) {
      console.error('Erro ao obter cliques:', err);
      res.status(500).send('Erro no servidor');
    }
  });

  const enderecoSchema = new mongoose.Schema({
    endereco: { type: String, required: true }
  });
  
  const Endereco = mongoose.model('Endereco', enderecoSchema);
  
  // Rota para salvar o endereço
  app.post('/salvar-endereco', async (req, res) => {
    try {
      const { endereco } = req.body;
      const novoEndereco = new Endereco({ endereco });
      await novoEndereco.save();
      res.status(201).json({ message: 'Endereço salvo com sucesso!', endereco });
    } catch (err) {
      console.error('Erro ao salvar endereço:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });
  
  // Rota para obter o endereço
  app.get('/obter-endereco', async (req, res) => {
    try {
      const endereco = await Endereco.findOne().sort({ _id: -1 }); // Obtém o último endereço salvo
      if (endereco) {
        return res.json({ endereco: endereco.endereco });
      }
      res.status(404).json({ message: 'Nenhum endereço encontrado' });
    } catch (err) {
      console.error('Erro ao obter endereço:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });
>>>>>>> 03c77a12ce59d30695e6182ea4313bd57724d3f4
  