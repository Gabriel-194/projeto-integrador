<?php
include('connection.php');
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro | Essence Wear</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="fixed-logo" class="fixed-logo">
        <div class="logo-text">ESSENCE</div>
    </div>

    <header id="header" class="header">
        <div class="container">
            <div class="header-container">
                <div class="mobile-menu-toggle">
                    <button id="menu-btn" aria-label="Abrir menu" class="header-element">
                        <i data-lucide="menu"></i>
                    </button>
                </div>
                
                <a href="index.php" class="mobile-menu-logo header-element">
                    ESSENCE
                </a>
                
                <nav class="header-nav">
                    <a href="index.php" class="nav-link header-element">Home</a>
                    <a href="loja.php" class="nav-link header-element">Loja</a>
                    <a href="sobre.php" class="nav-link header-element">Sobre</a>
                </nav>
                
                <div class="header-actions">
                    <button id="search-btn" aria-label="Pesquisar" class="header-element">
                        <i data-lucide="search"></i>
                    </button>
                     <a href="perfil.php" id="user-profile-icon" aria-label="Perfil do usuário" class="header-element">
                        <i data-lucide="user"></i>
                    </a>
                    <a href="carrinho.php" aria-label="Carrinho de compras" class="cart-button header-element">
                        <i data-lucide="shopping-cart"></i>
                        <span id="cart-count">0</span>
                    </a>
                </div>
            </div>
        </div>
        
        <div id="mobile-menu" class="mobile-menu hidden">
            <nav class="mobile-menu-nav">
                <a href="index.php" class="nav-link">Home</a>
                <a href="loja.php" class="nav-link">Loja</a>
                <a href="sobre.php" class="nav-link">Sobre</a>
            </nav>
        </div>
    </header>

    <main>
        <div class="login-page container" style="justify-content: center;">
            <div class="register-form-container">
                 <h1 class="login-title">Criar Conta</h1>
                 <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="register-name">Nome Completo</label>
                        <input type="text" id="register-name" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Senha</label>
                        <input type="password" id="register-password" required minlength="6">
                    </div>
                     <div class="form-group">
                        <label for="register-cpf">CPF</label>
                        <input type="text" id="register-cpf" required>
                    </div>
                     <div class="form-group">
                        <label for="register-telefone">Telefone</label>
                        <input type="text" id="register-telefone" required>
                    </div>

                    <h2 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; text-align: center;">Endereço</h2>
                    <div class="form-group">
                        <label for="register-cep">CEP</label>
                        <input type="text" id="register-cep" required>
                    </div>
                    <div class="form-group">
                        <label for="register-logradouro">Logradouro (Rua/Avenida)</label>
                        <input type="text" id="register-logradouro" required>
                    </div>
                    <div class="form-group">
                        <label for="register-numero">Número</label>
                        <input type="text" id="register-numero" required>
                    </div>
                    <div class="form-group">
                        <label for="register-bairro">Bairro</label>
                        <input type="text" id="register-bairro" required>
                    </div>
                    <div class="form-group">
                        <label for="register-cidade">Cidade</label>
                        <input type="text" id="register-cidade" required>
                    </div>
                     <div class="form-group">
                        <label for="register-estado">Estado (UF)</label>
                        <input type="text" id="register-estado" required maxlength="2">
                    </div>

                    <p id="register-error" class="auth-error hidden"></p>
                    <p id="register-success" class="auth-success hidden"></p>
                    <button type="submit" class="btn-primary auth-button">Cadastrar</button>
                    <p class="text-center" style="margin-top: 1rem;">Já tem uma conta? <a href="login.php" style="text-decoration: underline;">Faça login</a>.</p>
                </form>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const cepInput = document.getElementById('register-cep');
            const logradouroInput = document.getElementById('register-logradouro');
            const bairroInput = document.getElementById('register-bairro');
            const cidadeInput = document.getElementById('register-cidade');
            const estadoInput = document.getElementById('register-estado');
            const numeroInput = document.getElementById('register-numero');

            if (cepInput) {
                cepInput.addEventListener('blur', handleCepSearch);
            }

            async function handleCepSearch() {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length !== 8) return;

                logradouroInput.value = "A procurar...";
                bairroInput.value = "A procurar...";
                cidadeInput.value = "A procurar...";

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (data.erro) throw new Error("CEP não encontrado.");
                    
                    logradouroInput.value = data.logradouro;
                    bairroInput.value = data.bairro;
                    cidadeInput.value = data.localidade;
                    estadoInput.value = data.uf;
                    numeroInput.focus();

                } catch (error) {
                    alert(error.message);
                    logradouroInput.value = "";
                    bairroInput.value = "";
                    cidadeInput.value = "";
                }
            }
            
            // --- LÓGICA DE SUBMISSÃO REAL ---
            const registerForm = document.getElementById("register-form");
            if(registerForm){
                registerForm.addEventListener("submit", async (e) => {
                    e.preventDefault(); // Previne o recarregamento da página

                    const successMsg = document.getElementById("register-success");
                    const errorMsg = document.getElementById("register-error");
                    errorMsg.classList.add("hidden");
                    successMsg.classList.add("hidden");

                    // Coleta todos os dados do formulário
                    const registrationData = {
                        name: document.getElementById("register-name").value,
                        email: document.getElementById("register-email").value,
                        password: document.getElementById("register-password").value,
                        cpf: document.getElementById("register-cpf").value,
                        telefone: document.getElementById("register-telefone").value,
                        cep: cepInput.value,
                        logradouro: logradouroInput.value,
                        numero: numeroInput.value,
                        bairro: bairroInput.value,
                        cidade: cidadeInput.value,
                        estado: estadoInput.value,
                    };

                    try {
                        // Envia os dados para a API de registo
                        const response = await fetch('api/register.php', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(registrationData)
                        });
                        const result = await response.json();

                        if (result.success) {
                            successMsg.textContent = result.message + " A redirecionar...";
                            successMsg.classList.remove("hidden");
                            registerForm.reset();
                            setTimeout(() => { window.location.href = 'login.php'; }, 2000);
                        } else {
                            throw new Error(result.message || "Ocorreu um erro desconhecido.");
                        }
                    } catch(error) {
                        errorMsg.textContent = error.message;
                        errorMsg.classList.remove("hidden");
                    }
                });
            }
        });
    </script>
</body>
</html>