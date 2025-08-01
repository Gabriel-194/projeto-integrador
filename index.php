<!DOCTYPE html>
<html lang="pt-BR">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Essence Wear | Streetwear Essencial</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
    />
    <script src="https://unpkg.com/lucide@latest"></script>

    <link rel="stylesheet" href="styles.css" />
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
      <a
      href="perfil.php"
      id="user-profile-icon"
      aria-label="Perfil do usuário"
      class="header-element"
      >
      <i data-lucide="user"></i>
      </a>
      <a
      href="carrinho.php"
      aria-label="Carrinho de compras"
      class="cart-button header-element"
      >
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
      <div id="banner-container" class="banner-container">
      <div class="banner-slide active">
      <img
      src="https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif"
      alt="Modelo de streetwear em ambiente urbano"
      />
      </div>
      <div class="banner-slide"> <img
      src="https://64.media.tumblr.com/db8472cfbb89a155148003b053d5f3de/4d6d987e0cee7307-8e/s400x225/158142e8e876044a6191733a02f6ee5ac1643b58.gif"
      alt="Detalhe de roupa streetwear"
      />
      </div>
      <div class="banner-overlay">
      <h1>Essence Wear</h1>
      <a href="loja.php" class="btn-banner">DESCUBRA MAIS</a>
      </div>
      </div>
      <section class="section bg-main">
      <div class="container">
      <div class="section-title">
      <h2>Lançamentos</h2>
      <p class="text-secondary">Seleção da semana.</p>
      </div>
      <div id="home-products-grid" class="products-grid"></div>
      </div>
      <div class="container-botao">
      <a href="loja.php" class="btn-primary"> Explorar Coleção </a>
      </div>
      </section>
       <section class="section bg-secondary">
      <div class="container">
        <div class="about-section-content">
        <div class="about-section-image">
        <img
        src="https://i.pinimg.com/736x/99/da/8c/99da8ce1f0c5aaa1ea80afa956c632d4.jpg"
        alt="" width=" 300px"/>
        </div>
        <div class="about-section-text">
        <h2>O Código</h2>
        <p>
        Não seguimos tendências, criamos o essencial. A Essence é um
        manifesto de individualidade, expresso através de um design
        limpo e materiais de alta performance. Cada peça é uma
        declaração.
        </p>
        <a href="sobre.php">A Nossa Visão</a>
        </div>
        </div>
        </div>
        </section>
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
          <button
          id="search-close-btn"
          class="search-close-btn"
          aria-label="Fechar pesquisa"
          >
          <i data-lucide="x"></i>
          </button>
              </div>
      <div class="search-input-wrapper">
      <i data-lucide="search"></i>
      <input
      type="text"
      id="search-input"
      placeholder="O que você procura?"
      />
      </div>
      <div
      id="search-results-container"
      class="search-results-container"
            ></div>
            </div>
          </div>
  <script src="script.js"></script>
</body>
</html>