document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAÇÕES GLOBAIS ---
    const API_BASE_URL = 'api'; // Pasta onde seus scripts da API estão

    // --- GERENCIAMENTO DE ESTADO NO NAVEGADOR ---
    // O carrinho continua no localStorage para simplicidade até o checkout.
    let cart = JSON.parse(localStorage.getItem("essenceCart")) || [];
    // O usuário logado fica na 'sessionStorage' (dura apenas enquanto a aba estiver aberta).
    let currentUser = JSON.parse(sessionStorage.getItem("essenceCurrentUser")) || null;

    const saveCart = () => localStorage.setItem("essenceCart", JSON.stringify(cart));
    const saveCurrentUser = (user) => {
        sessionStorage.setItem("essenceCurrentUser", JSON.stringify(user));
        currentUser = user;
    };
    const clearCurrentUser = () => {
        sessionStorage.removeItem("essenceCurrentUser");
        currentUser = null;
    };


    // =================================================================
    // --- FUNÇÕES UTILITÁRIAS E GLOBAIS ---
    // =================================================================

    const formatPrice = (price) => `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`;

    const updateCartCount = () => {
        const el = document.getElementById("cart-count");
        if (el) el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    };

    const updateUserIcon = () => {
        const el = document.getElementById("user-profile-icon");
        if (el) el.href = currentUser ? 'perfil.php' : 'login.php';
    };

    const createProductCard = (product) => `
        <a href="produto.php?id=${product.id}" class="product-card">
            <div class="product-card-image-wrapper">
                <img src="${product.imagem_principal || product.image}" alt="${product.nome || product.name}">
            </div>
            <div class="product-card-info">
                <h3>${product.nome || product.name}</h3>
                <p class="text-secondary">${formatPrice(product.preco || product.price)}</p>
            </div>
        </a>`;

    const renderProducts = (gridElement, productList) => {
        if (!gridElement) return;
        if (productList.length > 0) {
            gridElement.innerHTML = productList.map(createProductCard).join("");
        } else {
            gridElement.innerHTML = `<p class="text-secondary text-center col-span-full">Nenhum produto encontrado.</p>`;
        }
    };
    
    const handleLogout = () => {
        clearCurrentUser();
        window.location.href = "index.php";
    };


    // =================================================================
    // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---
    // =================================================================

// --- FUNÇÃO GENÉRICA PARA BUSCAR PRODUTOS ---
const fetchProducts = async () => {
    try {
        // --- CORREÇÃO AQUI --- Removido o "/products" do caminho
        const response = await fetch(`${API_BASE_URL}/get_products.php`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        // Esta mensagem de erro deve aparecer na consola do navegador (F12)
        console.error("Falha ao buscar produtos da API:", error);
        return []; // Retorna um array vazio em caso de erro
    }
};

    // --- PÁGINA INICIAL ---
    const initHomePage = async () => {
        const homeGrid = document.getElementById("home-products-grid");
        if (homeGrid) {
            homeGrid.innerHTML = "<p>Carregando lançamentos...</p>";
            const allProducts = await fetchProducts();
            renderProducts(homeGrid, allProducts.slice(0, 4));
        }
    };

    // --- PÁGINA DA LOJA ---
    const initShopPage = async () => {
        const shopGrid = document.getElementById("shop-products-grid");
        const filterButtons = document.querySelectorAll(".filter-btn");

        if (shopGrid) {
            shopGrid.innerHTML = "<p>Carregando todos os produtos...</p>";
            const allProducts = await fetchProducts();
            renderProducts(shopGrid, allProducts); // Renderiza todos inicialmente

            const filterProducts = (category) => {
                if (category === "Todos") {
                    renderProducts(shopGrid, allProducts);
                } else {
                    const filtered = allProducts.filter(p => p.categoria === category);
                    renderProducts(shopGrid, filtered);
                }
            };

            filterButtons.forEach(button => {
                button.addEventListener("click", () => {
                    filterButtons.forEach(btn => btn.classList.replace("btn-primary", "btn-secondary"));
                    button.classList.replace("btn-secondary", "btn-primary");
                    filterProducts(button.dataset.category);
                });
            });
        }
    };
  
    // --- PÁGINA DE PRODUTO ---
// No script.js, substitua a função initProductPage por esta
const initProductPage = async () => {
    const container = document.getElementById("product-detail-container");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        container.innerHTML = `<p>Produto inválido. <a href="loja.php">Voltar para a loja</a>.</p>`;
        return;
    }

    container.innerHTML = "<p>Carregando detalhes do produto...</p>";

    try {
        // Nova chamada à API específica
        const response = await fetch(`${API_BASE_URL}/products/get_product_details.php?id=${productId}`);
        const result = await response.json();

        if (result.success) {
            const product = result.data;
            // A descrição agora vem do banco de dados!
            container.innerHTML = `
                <div class="product-detail-content">
                    <div class="product-images"><img id="main-product-image" src="${product.imagem_principal}" alt="${product.nome}"></div>
                    <div class="product-info">
                        <h1>${product.nome}</h1>
                        <p class="price">${formatPrice(product.preco)}</p>
                        <p class="description">${product.descricao || 'Descrição não disponível.'}</p>
                        <div class="add-to-cart-section">
                            <button class="add-cart-btn btn-primary" data-product-id="${product.id}" data-product-name="${product.nome}" data-product-price="${product.preco}" data-product-image="${product.imagem_principal}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>`;
        } else {
            throw new Error(result.message);
        }
    } catch(error) {
        container.innerHTML = `<p>Erro ao carregar produto: ${error.message} <a href="loja.php">Voltar para a loja</a>.</p>`;
    }
};

    // --- PÁGINA DE LOGIN E CADASTRO ---
    // --- PÁGINA DE LOGIN E CADASTRO ---
// --- PÁGINA DE LOGIN E CADASTRO ---
const initLoginPage = () => {
    // Se o usuário já estiver logado, redireciona para o perfil
    if (currentUser) {
        window.location.href = 'perfil.php';
        return;
    }

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // --- LÓGICA DO FORMULÁRIO DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            // --- ALTERAÇÃO 1: A variável agora se chama 'username' para maior clareza ---
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const errorMsg = document.getElementById("login-error");

            errorMsg.classList.add("hidden");

            try {
                // 1. FAZ O FETCH PARA A API DE LOGIN
                const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // --- ALTERAÇÃO 2: Enviamos o 'username' em vez de 'email' ---
                    body: JSON.stringify({ username: username, password: password })
                });

                const result = await response.json();

                // 2. VERIFICA O RESULTADO DA API
                if (result.success) {
                    // 3. SE O LOGIN FOR BEM-SUCEDIDO:
                    saveCurrentUser(result.user);
                    window.location.href = 'perfil.php';
                } else {
                    throw new Error(result.message || "Ocorreu um erro desconhecido.");
                }

            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove("hidden");
            }
        });
    }

    // A lógica de registro continua a mesma, pois ela já envia 'name', 'email' e 'password'.
    if (registerForm) {
        // ... (o seu código do formulário de registro permanece igual)
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const successMsg = document.getElementById("register-success");
            const errorMsg = document.getElementById("register-error");
            
            errorMsg.classList.add("hidden");
            successMsg.classList.add("hidden");

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, password })
                });
                const result = await response.json();

                if (result.success) {
                    successMsg.textContent = result.message + " Faça o login para continuar.";
                    successMsg.classList.remove("hidden");
                    registerForm.reset();
                } else {
                    throw new Error(result.message || "Ocorreu um erro desconhecido.");
                }
            } catch(error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove("hidden");
            }
        });
    }
};

    // --- PÁGINA DE PERFIL ---
    const initProfilePage = () => {
        const container = document.getElementById("profile-page-container");
        if (!currentUser) {
            window.location.href = 'login.php';
            return;
        }

        // A lógica do painel de admin também precisará de APIs para adicionar/remover produtos
        container.innerHTML = `
            <h1>Olá, ${currentUser.name.split(' ')[0]}</h1>
            <div class="profile-info">
                <p><strong>Nome:</strong> ${currentUser.name}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
            </div>
            <button id="logout-btn" class="btn-primary btn-danger">Sair da Conta</button>`;
        
        document.getElementById("logout-btn").addEventListener("click", handleLogout);
    };


    // --- PÁGINA DO CARRINHO ---
    const renderCartPage = () => {
        const container = document.getElementById("carrinho-container");
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `<div class="cart-empty"><h2>O seu carrinho está vazio.</h2><a href="loja.php" class="btn-primary">Continuar a comprar</a></div>`;
            return;
        }

        const cartItemsHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Preço: ${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <p>Qtd: ${item.quantity}</p>
                    <button class="remove-cart-item-btn" data-index="${index}" style="background:none; border:none; color:red; text-decoration:underline; cursor:pointer;">Remover</button>
                </div>
            </div>`).join("");
        
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        
        container.innerHTML = `
            <h2>O seu Carrinho</h2>
            <div class="cart-items-list">${cartItemsHTML}</div>
            <div class="cart-summary">
                <h3>Total: ${formatPrice(totalPrice)}</h3>
                <button class="btn-primary">Finalizar Compra</button>
            </div>`;
    };

    // =================================================================
    // --- INICIALIZAÇÃO E EVENT LISTENERS GLOBAIS ---
    // =================================================================

    const init = () => {
        updateUserIcon();
        updateCartCount();
        lucide.createIcons();
        
        // Roteamento simples baseado no ID de um elemento principal da página
        if (document.getElementById("home-products-grid")) initHomePage();
        if (document.getElementById("shop-products-grid")) initShopPage();
        if (document.getElementById("product-detail-container")) initProductPage();
        if (document.getElementById("login-form")) initLoginPage();
        if (document.getElementById("profile-page-container")) initProfilePage();
        if (document.getElementById("carrinho-container")) renderCartPage();

        document.body.addEventListener("click", (e) => {
            const target = e.target;
            
            // Adicionar ao carrinho
            if (target.matches('.add-cart-btn')) {
                e.preventDefault();
                const productId = target.dataset.productId;
                const existingItem = cart.find(item => item.productId === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        productId: productId,
                        name: target.dataset.productName,
                        price: parseFloat(target.dataset.productPrice),
                        image: target.dataset.productImage,
                        quantity: 1
                    });
                }
                saveCart();
                updateCartCount();
                target.textContent = "Adicionado ✓";
                target.classList.add("btn-success");
                setTimeout(() => {
                    target.textContent = "Adicionar ao Carrinho";
                    target.classList.remove("btn-success");
                }, 2000);
            }

            // Remover do carrinho
            if (target.matches('.remove-cart-item-btn')) {
                const itemIndex = parseInt(target.dataset.index, 10);
                cart.splice(itemIndex, 1);
                saveCart();
                updateCartCount();
                renderCartPage(); // Re-renderiza a página do carrinho
            }
        });
    };

    init();
});