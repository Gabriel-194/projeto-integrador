<?php
include('connection.php');
session_start();

// Proteção: se o usuário não estiver logado, redireciona para o login
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Perfil | Essence Wear</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Estilos adicionais específicos para a página de perfil */
        .profile-page { padding: 4rem 1.5rem; max-width: 1024px; }
        .profile-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: flex-start; }
        .profile-card { background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 0.5rem; padding: 2rem; }
        .profile-card h2 { margin-bottom: 1.5rem; border-bottom: 1px solid #e5e5e5; padding-bottom: 1rem; }
        .profile-card p { line-height: 1.8; color: #333; }
        .profile-card strong { color: #0a0a0a; }
        #logout-btn { margin-top: 1.5rem; width: 100%; }
        .order-history-list .order-card { background-color: #fff; border: 1px solid #e5e5e5; border-radius: 0.5rem; margin-bottom: 1.5rem; }
        .order-header { padding: 1rem 1.5rem; background-color: #f9f9f9; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; }
        .order-items { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .order-item { display: flex; align-items: center; gap: 1rem; }
        .order-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 0.25rem; }
        .order-item-details p { margin: 0; }
        .order-item-details span { font-size: 0.875rem; color: #666; }

        /* Media Query para telas menores */
        @media (max-width: 768px) {
            .profile-grid {
                grid-template-columns: 1fr; /* Coloca os cartões um sobre o outro */
            }
        }
    </style>
</head>
<body>
    <header id="header" class="header">
        <div class="container">
            <div class="header-container">
                <div class="mobile-menu-toggle">
                    <button id="menu-btn" aria-label="Abrir menu" class="header-element">
                        <i data-lucide="menu"></i>
                    </button>
                </div>
                <a href="index.php" class="mobile-menu-logo header-element">ESSENCE</a>
                <nav class="header-nav">
                    <a href="index.php" class="nav-link header-element">Home</a>
                    <a href="loja.php" class="nav-link header-element">Loja</a>
                    <a href="sobre.php" class="nav-link header-element">Sobre</a>
                </nav>
                <div class="header-actions">
                    <button aria-label="Pesquisar" class="header-element">
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
    </header>

    <main>
        <div id="profile-page-container" class="profile-page container">
            <p>A carregar informações do perfil...</p>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>