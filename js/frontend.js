//import axios from 'axios'
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita o envio padrão do formulário

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    console.log('Tentando fazer login com:', { username, password })

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        console.log('Resposta do servidor:', response)

        if (response.ok) {
            // Redireciona para a página do painel
            window.location.href = 'painel-adm.html'
        } else {
            const errorText = await response.text()
            alert(errorText) // Exibe mensagem de erro
        }
    } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao fazer login. Tente novamente.')
    }
})


async function adicionarPostagem(){
    let assuntoInput = document.querySelector('#assunto_campo')
    let conteudoInput = document.querySelector('#conteudo_campo')
    let assunto = assuntoInput.value
    let conteudo = conteudoInput.value
    if (assunto && conteudo) {
        try{
            const URLCompleta = 'http://127.0.0.1:3000/posts'  
            await axios.post(URLCompleta, { assunto: assunto, conteudo: conteudo })
            assuntoInput.value = ""
            conteudoInput.value = ""
            console.log('oi')
        }
        catch(error){
            console.log('deu erro' + error)
        }
    }
    else{
    console.log('Algum campo está vazio')
    }
    }

async function loadPosts() {
    const response = await fetch('http://localhost:3000/posts');
    let posts = await response.json();

   
    posts = posts
        .map(post => ({ ...post, data: new Date(post.data) }))
        .filter(post => !isNaN(post.data)); 
    
    
    posts.sort((a, b) => b.data - a.data);

    postsContainer.innerHTML = '';  
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('card', 'mb-3');
        postCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.assunto}</h5>
                <p class="card-text">${post.conteudo}</p>
                <p class="card-text"><small class="text-muted">${post.data.toLocaleString()}</small></p>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}
    
function alterarCor(tipo) {
    const content = document.getElementById('corNav');
    content.classList.add('daltonismo')
}

function aumentarFonte() {
    const elementos = document.querySelectorAll('body, h1, h2, h3, p');

      
      elementos.forEach(function(elemento) {
        const estiloAtual = window.getComputedStyle(elemento);
        const tamanhoFonteAtual = parseFloat(estiloAtual.fontSize);

       
        const novoTamanhoFonte = tamanhoFonteAtual + 2;

        
        elemento.style.fontSize = novoTamanhoFonte + 'px';
      });
}

function lerPaginaInteira() {
    const textos = document.body.innerText;
     responsiveVoice.speak(textos, "Portuguese Female");
}

