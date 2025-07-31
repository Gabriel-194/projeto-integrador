<?php
include('connection.php');

?>



<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sobre Nós | Essence Wear</title>
    
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
        
        <div id="mobile-menu" class="mobile-menu hidden">
            <nav class="mobile-menu-nav">
                <a href="index.php" class="nav-link">Home</a>
                <a href="loja.php" class="nav-link">Loja</a>
                <a href="sobre.php" class="nav-link">Sobre</a>
            </nav>
        </div>
    </header>

    <main>
        <div class="about-page container">
            <h1>Sobre a Essence</h1>
            <div class="divider"></div>
            <div class="about-text">
                <p>A Essence Wear foi fundada em 2023 sob um princípio fundamental: criar mais com menos. Num mundo saturado por ciclos de moda rápidos e descartáveis, a nossa proposta é um retorno ao essencial. Focamo-nos em design atemporal, funcionalidade e uma estética minimalista que resiste ao teste do tempo.</p>
                <p>Cada coleção é uma edição limitada, produzida com responsabilidade e atenção aos detalhes. Não somos uma marca de fast-fashion. Somos uma plataforma para a autoexpressão através de peças que servem como uma tela em branco para o seu estilo pessoal. Acreditamos que a verdadeira confiança vem de vestir algo que não apenas parece bom, mas que também representa uma escolha consciente.</p>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
    </footer>
    <div id="search-overlay" class="search-overlay">
        <div class="search-modal">
            <div class="search-header">
                <h3 class="search-title">Pesquisar Produtos</h3>
                <button id="search-close-btn" class="search-close-btn" aria-label="Fechar pesquisa">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="search-input-wrapper">
                <i data-lucide="search"></i>
                <input type="text" id="search-input" placeholder="O que você procura?">
            </div>
            <div id="search-results-container" class="search-results-container">
                </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>