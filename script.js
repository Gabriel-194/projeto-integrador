document.addEventListener("DOMContentLoaded", () => {
  // --- BASE DE DADOS DE PRODUTOS ---
  let products = JSON.parse(localStorage.getItem("essenceProducts")) || {
    1: { id: "1", name: "ESSENCE Classic Black", price: 149.99, category: "Blusas", image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", description: "Hoodie premium com design minimalista e conforto excepcional.", images: ["https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg"], colors: ["Preto", "Branco"], stock: 15, reviews: [{ author: "Ana Silva", rating: 5, comment: "Adorei o hoodie, super confortável!" }] },
    6: { id: "6", name: "ESSENCE Minimal Tee", price: 89.99, category: "Camisetas", image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", description: "Camiseta minimalista com corte moderno e tecido premium.", images: ["https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg"], colors: ["Branco", "Preto"], stock: 25, reviews: [] },
    7: { id: "7", name: "ESSENCE Urban Runner", price: 349.99, category: "Tenis", image: "https://i.pinimg.com/736x/c5/d9/23/c5d9233ad149c445a35366b2d8616c35.jpg", description: "Tênis de design moderno para o dia a dia.", images: ["https://i.pinimg.com/736x/c5/d9/23/c5d9233ad149c445a35366b2d8616c35.jpg"], colors: ["Preto/Branco"], stock: 12, reviews: [] },
    8: { id: "8", name: "ESSENCE Cargo Pants", price: 229.90, category: "Calcas", image: "https://i.pinimg.com/736x/bf/b3/c7/bfb3c7648a88372b43c2a91214f7e812.jpg", description: "Calça cargo com tecido resistente e múltiplos bolsos.", images: ["https://i.pinimg.com/736x/bf/b3/c7/bfb3c7648a88372b43c2a91214f7e812.jpg"], colors: ["Verde Militar", "Preto"], stock: 18, reviews: [] }
  };
  const saveProducts = () => localStorage.setItem("essenceProducts", JSON.stringify(products));

  // --- SISTEMA DE CARRINHO E USUÁRIOS ---
  let cart = JSON.parse(localStorage.getItem("essenceCart")) || [];
  let users = JSON.parse(localStorage.getItem("essenceUsers")) || [];
  let currentUser = JSON.parse(sessionStorage.getItem("essenceCurrentUser")) || null;
  
  const saveCart = () => localStorage.setItem("essenceCart", JSON.stringify(cart));
  const saveUsers = () => localStorage.setItem("essenceUsers", JSON.stringify(users));
  const saveCurrentUser = () => sessionStorage.setItem("essenceCurrentUser", JSON.stringify(currentUser));

  // =================================================================
  // --- FUNÇÕES GLOBAIS ---
  // =================================================================

  const formatPrice = (price) => `R$ ${price.toFixed(2).replace(".", ",")}`;
  const updateCartCount = () => {
    const el = document.getElementById("cart-count");
    if (el) el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  };
  const updateUserIcon = () => {
    const el = document.getElementById("user-profile-icon");
    if (el) el.href = currentUser ? 'perfil.html' : 'login.html';
  };
  const createProductCard = (product) => `
    <a href="produto.html?id=${product.id}" class="product-card">
      <div class="product-card-image-wrapper"><img src="${product.image}" alt="${product.name}"></div>
      <div class="product-card-info"><h3>${product.name}</h3><p class="text-secondary">${formatPrice(product.price)}</p></div>
    </a>`;
  const renderProducts = (gridElement, productList) => {
    if (gridElement) gridElement.innerHTML = productList.map(createProductCard).join("");
  };
  const handleLogout = () => {
    currentUser = null;
    sessionStorage.removeItem("essenceCurrentUser");
    window.location.href = "index.html";
  };

  const showLoginModal = () => {
      const modalHTML = `
        <div id="login-required-modal" class="custom-modal-overlay">
            <div class="custom-modal">
                <h3>Acesso Necessário</h3>
                <p>Você precisa estar logado para adicionar produtos ao carrinho.</p>
                <button id="modal-login-btn" class="btn-primary">Ir para Login</button>
            </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      const modal = document.getElementById('login-required-modal');
      setTimeout(() => modal.classList.add('open'), 10);
      document.getElementById('modal-login-btn').addEventListener('click', () => { window.location.href = 'login.html'; });
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  };

  const initSearch = () => {
      const searchButton = document.querySelector('button[aria-label="Pesquisar"]');
      const searchOverlay = document.getElementById("search-overlay");
      const searchCloseBtn = document.getElementById("search-close-btn");
      const searchInput = document.getElementById("search-input");
      const searchResultsContainer = document.getElementById("search-results-container");

      if (!searchOverlay) return;

      const openSearch = () => {
          searchOverlay.classList.add("open");
          lucide.createIcons();
          searchInput.focus();
      };
      const closeSearch = () => {
          searchOverlay.classList.remove("open");
          searchInput.value = "";
          searchResultsContainer.innerHTML = "";
      };

      searchButton.addEventListener("click", openSearch);
      searchCloseBtn.addEventListener("click", closeSearch);
      searchOverlay.addEventListener("click", (e) => { if (e.target === searchOverlay) closeSearch(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && searchOverlay.classList.contains("open")) closeSearch(); });
      searchInput.addEventListener("input", (e) => {
          const query = e.target.value.toLowerCase().trim();
          if (query.length < 2) {
              searchResultsContainer.innerHTML = "";
              return;
          }
          const results = Object.values(products).filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
          if (results.length > 0) {
              searchResultsContainer.innerHTML = `<div class="products-grid">${results.map(createProductCard).join("")}</div>`;
          } else {
              searchResultsContainer.innerHTML = `<div class="search-no-results"><p>Nenhum produto encontrado para "<strong>${query}</strong>"</p></div>`;
          }
      });
  };


  // =================================================================
  // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---
  // =================================================================

    // --- PÁGINA INICIAL ---
    const initHomePage = () => {
        renderProducts(document.getElementById("home-products-grid"), Object.values(products).slice(0, 4));
        const bannerContainer = document.getElementById("banner-container");
        const header = document.getElementById("header");
        if (!bannerContainer || !header) return;

        const updateHeaderStyle = () => {
            const isOverBanner = bannerContainer.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom;
            document.body.classList.toggle("body-over-banner", isOverBanner);
        };
        window.addEventListener("scroll", updateHeaderStyle);
        updateHeaderStyle();
    };

  // --- PÁGINA DE LOGIN E CADASTRO ---
    const initLoginPage = () => {
        if (currentUser) {
            window.location.href = 'perfil.html';
            return;
        }
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            if (username === "admin" && password === "admin123") {
                currentUser = { name: "Admin", username: "admin", isAdmin: true };
                saveCurrentUser();
                window.location.href = "perfil.html";
            } else {
                const foundUser = users.find(user => user.username === username && user.password === password);
                if (foundUser) {
                    currentUser = { ...foundUser, isAdmin: false };
                    saveCurrentUser();
                    window.location.href = "perfil.html";
                } else {
                    document.getElementById("login-error").classList.remove("hidden");
                }
            }
        });

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const username = email.split('@')[0];
            if (users.find(user => user.email === email || user.username === username)) {
                document.getElementById("register-error").classList.remove("hidden");
            } else {
                users.push({ name, email, username, password });
                saveUsers();
                document.getElementById("register-success").classList.remove("hidden");
                setTimeout(() => {
                    currentUser = { name, email, username, isAdmin: false };
                    saveCurrentUser();
                    window.location.href = "perfil.html";
                }, 1500);
            }
        });
    };

  // --- PÁGINA DE PERFIL (E PAINEL DE ADMIN) ---
    const initProfilePage = () => {
        const container = document.getElementById("profile-page-container");
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        if (currentUser.isAdmin) {
            const renderAdminPanel = () => {
                const productListHTML = Object.values(products).map(p => `
                    <div class="cart-item">
                        <img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                        <div class="cart-item-info"><h3>${p.name}</h3><p>${p.category} - ${formatPrice(p.price)}</p></div>
                        <div class="cart-item-actions"><button class="remove-product-btn btn-danger" data-product-id="${p.id}" style="padding: 0.5rem 1rem; border: none; cursor: pointer;">Remover</button></div>
                    </div>`).join('');
                container.innerHTML = `
                    <h1>Painel do Administrador</h1><p>Bem-vindo, ${currentUser.name}.</p>
                    <div id="admin-add-product" style="margin-top: 2rem;"><form id="add-product-form" class="auth-form">
                        <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-align: left;">Adicionar Produto</h2>
                        <div class="form-group"><label>Nome</label><input type="text" id="product-name" required></div>
                        <div class="form-group"><label>Preço</label><input type="number" step="0.01" id="product-price" required></div>
                        <div class="form-group"><label>Categoria</label><input type="text" id="product-category" placeholder="Blusas, Camisetas, Bermudas, Calcas, Tenis" required></div>
                        <div class="form-group"><label>URL da Imagem</label><input type="url" id="product-image" required></div>
                        <div class="form-group"><label>Estoque</label><input type="number" id="product-stock" required></div>
                        <div class="form-group"><label>Cores (separadas por vírgula)</label><input type="text" id="product-colors" required></div>
                        <div class="form-group"><label>Descrição</label><textarea id="product-description" rows="3" style="width: 100%; padding: 0.5rem;"></textarea></div>
                        <p id="add-product-success" class="auth-success hidden">Produto adicionado!</p><button type="submit" class="btn-primary auth-button">Adicionar</button>
                    </form></div>
                    <div id="admin-remove-product" style="margin-top: 3rem;"><h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-align: left;">Gerenciar Produtos</h2><div class="cart-items-list">${productListHTML}</div></div>
                    <button id="logout-btn" class="btn-primary btn-danger" style="margin-top: 3rem;">Sair da Conta</button>`;
            };
            const handleAddProduct = (e) => {
                e.preventDefault();
                const form = e.target;
                products[Date.now().toString()] = {
                    id: Date.now().toString(),
                    name: form.querySelector("#product-name").value,
                    price: parseFloat(form.querySelector("#product-price").value),
                    category: form.querySelector("#product-category").value,
                    image: form.querySelector("#product-image").value,
                    description: form.querySelector("#product-description").value,
                    images: [form.querySelector("#product-image").value],
                    stock: parseInt(form.querySelector("#product-stock").value, 10),
                    colors: form.querySelector("#product-colors").value.split(",").map(s => s.trim()),
                    reviews: [],
                };
                saveProducts();
                form.reset();
                document.getElementById("add-product-success").classList.remove("hidden");
                setTimeout(() => document.getElementById("add-product-success").classList.add("hidden"), 3000);
                renderAdminPanel();
            };
            const handleRemoveProduct = (productId) => {
                if (confirm(`Tem certeza que deseja remover o produto "${products[productId].name}"?`)) {
                    delete products[productId];
                    saveProducts();
                    renderAdminPanel();
                }
            };
            renderAdminPanel();
            container.addEventListener('submit', e => { if (e.target.id === 'add-product-form') handleAddProduct(e); });
            container.addEventListener('click', e => {
                if (e.target.matches('.remove-product-btn')) handleRemoveProduct(e.target.dataset.productId);
                if (e.target.id === 'logout-btn') handleLogout();
            });
        } else {
            container.innerHTML = `<h1>Olá, ${currentUser.name.split(' ')[0]}</h1><div class="profile-info"><p><strong>Nome:</strong> ${currentUser.name}</p><p><strong>Usuário:</strong> ${currentUser.username}</p><p><strong>Email:</strong> ${currentUser.email}</p></div><button id="logout-btn" class="btn-primary btn-danger">Sair da Conta</button>`;
            document.getElementById("logout-btn").addEventListener("click", handleLogout);
        }
    };

  // --- PÁGINA DA LOJA ---
    const initShopPage = () => {
        const shopGrid = document.getElementById("shop-products-grid");
        const filterButtons = document.querySelectorAll(".filter-btn");
        const renderShop = (filter = "Todos") => renderProducts(shopGrid, Object.values(products).filter(p => filter === "Todos" || p.category === filter));
        filterButtons.forEach(button => button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.replace("btn-primary", "btn-secondary"));
            button.classList.replace("btn-secondary", "btn-primary");
            renderShop(button.dataset.category);
        }));
        renderShop();
    };
  
  // --- PÁGINA DE PRODUTO ---
    const initProductPage = () => {
        const container = document.getElementById("product-detail-container");
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        const product = products[productId];

        if (product) {
            let sizeButtonsHTML = (product.category === 'Tenis') 
                ? Array.from({ length: 9 }, (_, i) => 35 + i).map(s => `<button class="size-btn">${s}</button>`).join('')
                : `<button class="size-btn">P</button><button class="size-btn">M</button><button class="size-btn">G</button><button class="size-btn">GG</button>`;

            const reviewsHTML = product.reviews.map(review => `
                <div class="review"><p><strong>${review.author}</strong> - <span>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></p><p>${review.comment}</p></div>`
            ).join('') || "<p>Ainda não existem avaliações para este produto.</p>";

            const reviewFormHTML = currentUser ? `
                <form id="review-form" class="auth-form" style="margin-top: 2rem;"><h4>Deixe sua avaliação</h4>
                    <div class="form-group"><label>Nota (1 a 5)</label><input type="number" id="review-rating" min="1" max="5" required style="max-width: 100px;"></div>
                    <div class="form-group"><label>Comentário</label><textarea id="review-comment" rows="3" required></textarea></div>
                    <button type="submit" class="btn-primary">Enviar Avaliação</button>
                </form>` : `<p style="margin-top: 2rem;">Você precisa estar <a href="login.html" style="text-decoration: underline;">logado</a> para deixar uma avaliação.</p>`;

            container.innerHTML = `
                <div class="product-detail-content">
                  <div class="product-images"><img id="main-product-image" src="${product.image}" alt="${product.name}"></div>
                  <div class="product-info">
                    <h1>${product.name}</h1><p class="price">${formatPrice(product.price)}</p>
                    <p class="stock">Disponibilidade: ${product.stock > 0 ? `${product.stock} em stock` : "Esgotado"}</p>
                    <p class="description">${product.description}</p>
                    <div class="size-selection"><h3>Tamanho:</h3><div class="size-buttons">${sizeButtonsHTML}</div></div>
                    <div class="color-selection"><h3>Cor:</h3><div class="color-buttons">${product.colors.map(color => `<button class="color-btn">${color}</button>`).join("")}</div></div>
                    <div class="add-to-cart-section">
                      <button class="add-cart-btn btn-primary" data-product-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>Adicionar ao Carrinho</button>
                      <p id="error-message" class="hidden">Por favor, selecione tamanho e cor.</p>
                    </div>
                  </div>
                </div>
                <div class="reviews-section"><h2>Avaliações de Clientes</h2>${reviewsHTML}${reviewFormHTML}</div>`;
            
            const reviewForm = document.getElementById("review-form");
            if (reviewForm) {
                reviewForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    product.reviews.push({
                        author: currentUser.name,
                        rating: parseInt(document.getElementById("review-rating").value),
                        comment: document.getElementById("review-comment").value
                    });
                    saveProducts();
                    initProductPage();
                });
            }
        } else {
            container.innerHTML = `<p>Produto não encontrado. <a href="loja.html">Voltar para a loja</a>.</p>`;
        }
    };

  // --- PÁGINA DO CARRINHO ---
    const renderCartPage = () => {
        const container = document.getElementById("carrinho-container");
        if (!container) return;
        if (cart.length === 0) {
            container.innerHTML = `<div class="cart-empty"><h2>O seu carrinho está vazio.</h2><a href="loja.html" class="btn-primary">Continuar a comprar</a></div>`;
            return;
        }
        const cartItemsHTML = cart.map((item, index) => {
            const product = products[item.productId];
            return `<div class="cart-item"><img src="${product.image}" alt="${product.name}"><div class="cart-item-info"><h3>${product.name}</h3><p>Tamanho: ${item.size}</p><p>Cor: ${item.color}</p><p>Preço: ${formatPrice(product.price)}</p></div><div class="cart-item-actions"><p>Qtd: ${item.quantity}</p><button class="remove-cart-item-btn" data-index="${index}">Remover</button></div></div>`;
        }).join("");
        const totalPrice = cart.reduce((total, item) => total + products[item.productId].price * item.quantity, 0);
        container.innerHTML = `<h2>O seu Carrinho</h2><div class="cart-items-list">${cartItemsHTML}</div><div class="cart-summary"><h3>Total: ${formatPrice(totalPrice)}</h3><button class="btn-primary">Finalizar Compra</button></div>`;
    };

  // =================================================================
  // --- INICIALIZAÇÃO E EVENT LISTENERS GLOBAIS ---
  // =================================================================

  const init = () => {
    updateUserIcon();
    updateCartCount();
    initSearch();
    lucide.createIcons();
    
    if (document.getElementById("banner-container")) initHomePage();
    else if (document.getElementById("login-form")) initLoginPage();
    else if (document.getElementById("profile-page-container")) initProfilePage();
    else if (document.getElementById("shop-products-grid")) initShopPage();
    else if (document.getElementById("product-detail-container")) initProductPage();
    else if (document.getElementById("carrinho-container")) renderCartPage();
    
    document.body.addEventListener("click", (e) => {
        const target = e.target;
        
        if (target.matches('.size-btn, .color-btn')) {
            const btnClass = target.matches('.size-btn') ? '.size-btn' : '.color-btn';
            target.closest('.size-buttons, .color-buttons').querySelectorAll(btnClass).forEach(btn => btn.classList.remove("selected"));
            target.classList.add("selected");
        }
        
        if (target.matches('.add-cart-btn')) {
            e.preventDefault();
            if (!currentUser) {
                showLoginModal();
                return;
            }
            const productId = target.dataset.productId;
            const selectedSizeEl = document.querySelector(".size-btn.selected");
            const selectedColorEl = document.querySelector(".color-btn.selected");

            if (!selectedSizeEl || !selectedColorEl) {
                document.getElementById("error-message")?.classList.remove("hidden");
                return;
            }
            document.getElementById("error-message")?.classList.add("hidden");

            const existingItem = cart.find(item => item.productId === productId && item.size === selectedSizeEl.textContent && item.color === selectedColorEl.textContent);
            if (existingItem) existingItem.quantity++;
            else cart.push({ productId, size: selectedSizeEl.textContent, color: selectedColorEl.textContent, quantity: 1 });
            
            saveCart();
            updateCartCount();
            target.textContent = "Adicionado ✓";
            target.classList.add("btn-success");
            setTimeout(() => { target.textContent = "Adicionar ao Carrinho"; target.classList.remove("btn-success"); }, 2000);
        }

        if (target.matches('.remove-cart-item-btn')) {
            cart.splice(parseInt(target.dataset.index, 10), 1);
            saveCart();
            updateCartCount();
            renderCartPage();
        }
    });
  };

  init();
});