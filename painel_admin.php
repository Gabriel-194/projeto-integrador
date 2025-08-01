<?php

session_start();
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
    header('Location: login.php');
    exit;
}
include('connection.php');
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Administrador | Essence Wear</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <main>
        <div class="profile-page container">
            <h1>Painel do Administrador</h1>
            <p>Bem-vindo, <?php echo htmlspecialchars($_SESSION['user']['nome_completo']); ?>.</p>
            
            <div class="admin-section">
                <h2>Gerenciar Produtos Existentes</h2>
                <div id="manage-products-list" class="admin-products-list">
                    <p>Carregando produtos...</p>
                </div>
            </div>

            <div class="admin-section">
                <h2>Adicionar Novo Produto</h2>
                <form id="add-product-form" class="auth-form">
                    <div class="form-group">
                        <label for="prod-nome">Nome do Produto</label>
                        <input type="text" id="prod-nome" required>
                    </div>
                    <div class="form-group">
                        <label for="prod-descricao">Descrição</label>
                        <textarea id="prod-descricao" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="prod-preco">Preço (ex: 149.99)</label>
                        <input type="number" step="0.01" id="prod-preco" required>
                    </div>
                    <div class="form-group">
                        <label for="prod-estoque">Estoque</label>
                        <input type="number" id="prod-estoque" required>
                    </div>
                    <div class="form-group">
                        <label for="prod-categoria">ID da Categoria</label>
                        <input type="number" id="prod-categoria" required placeholder="1=Blusas, 2=Camisetas, etc.">
                    </div>
                    <div class="form-group">
                        <label for="prod-imagem">URL da Imagem Principal</label>
                        <input type="text" id="prod-imagem" required>
                    </div>
                    <p id="admin-error" class="auth-error hidden"></p>
                    <p id="admin-success" class="auth-success hidden"></p>
                    <button type="submit" class="btn-primary auth-button">Adicionar Produto</button>
                </form>
            </div>
            
            <button id="logout-btn" class="btn-primary btn-danger" style="margin-top: 2rem;">Sair da Conta</button>
        </div>
    </main>
    
    <script src="script.js"></script>
</body>
</html>