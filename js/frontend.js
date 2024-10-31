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