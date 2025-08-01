document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAÇÕES GLOBAIS ---
<<<<<<< HEAD
    const API_BASE_URL = 'api';
=======
    const API_BASE_URL = 'api'; 
>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280

    // --- GERENCIAMENTO DE ESTADO NO NAVEGADOR ---
    let cart = JSON.parse(localStorage.getItem("essenceCart")) || [];
    let currentUser = JSON.parse(sessionStorage.getItem("essenceCurrentUser")) || null;

    const saveCart = () => localStorage.setItem("essenceCart", JSON.stringify(cart));
    const saveCurrentUser = (user) => {
        sessionStorage.setItem("essenceCurrentUser", JSON.stringify(user));
        currentUser = user;
    };
    const clearCurrentUser = () => {
        sessionStorage.removeItem("essenceCurrentUser");
        currentUser = null;
        window.location.href = "index.php"; // Redireciona para a home após logout
    };

    // --- FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_products.php`);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi ok');
            }
            const products = await response.json();
            return products;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            // Retorna um array vazio em caso de erro para não quebrar a página
            return [];
        }
    };


    // =================================================================
    // --- FUNÇÕES UTILITÁRIAS E GLOBAIS ---
    // (As funções formatPrice, updateCartCount, createProductCard, etc. continuam iguais)
    // =================================================================
    
    const formatPrice = (price) => `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`;
    const updateCartCount = () => { /* ...código igual... */ };
    const createProductCard = (product) => { /* ...código igual... */ };
    const renderProducts = (gridElement, productList) => { /* ...código igual... */ };
    
    const updateUserIcon = () => {
        const el = document.getElementById("user-profile-icon");
        if (!el) return;
        // O ícone de utilizador leva sempre para o perfil, que depois redireciona se necessário.
        el.href = 'perfil.php'; 
    };

    // =================================================================
    // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---
    // =================================================================

<<<<<<< HEAD
    // --- PÁGINA DE LOGIN (LÓGICA DE REDIRECIONAMENTO CORRIGIDA) ---
    const initLoginPage = () => {
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const username = document.getElementById("login-username").value;
                const password = document.getElementById("login-password").value;
                const errorMsg = document.getElementById("login-error");
                errorMsg.classList.add("hidden");

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const result = await response.json();

                    if (result.success) {
                        saveCurrentUser(result.user);
                        // --- REDIRECIONAMENTO INTELIGENTE ---
                        if (result.user.is_admin == 1) {
                            window.location.href = 'painel_admin.php'; // Se for admin, vai para o painel
                        } else {
                            window.location.href = 'perfil.php'; // Se não, vai para o perfil normal
                        }
                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    errorMsg.textContent = error.message;
                    errorMsg.classList.remove("hidden");
=======
    // --- FUNÇÃO GENÉRICA PARA BUSCAR PRODUTOS ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_products.php`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Falha ao buscar produtos da API:", error);
            return [];
        }
    };
    
    // --- NOVO: LÓGICA DO BANNER ROTATIVO ---
    const initBanner = () => {
        const slides = document.querySelectorAll(".banner-slide");
        if (slides.length < 2) return; // Não faz nada se houver menos de 2 slides
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) {
                    slide.classList.add("active");
                }
            });
        };
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 3000); // Muda de slide a cada 5 segundos
    };

    // --- PÁGINA INICIAL ---
    const initHomePage = async () => {
        initBanner(); // Adicionando a inicialização do banner aqui
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
            renderProducts(shopGrid, allProducts);

            const filterProducts = (category) => {
                if (category === "Todos") {
                    renderProducts(shopGrid, allProducts);
                } else {
                    const filtered = allProducts.filter(p => p.categoria === category);
                    renderProducts(shopGrid, filtered);
>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280
                }
            });
        }
        // A lógica do registerForm continua igual...
    };
<<<<<<< HEAD

    // --- PÁGINA DE PERFIL NORMAL ---
=======
 
    // --- PÁGINA DE PRODUTO ---
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
            const response = await fetch(`${API_BASE_URL}/products/get_product_details.php?id=${productId}`);
            const result = await response.json();

            if (result.success) {
                const product = result.data;
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
    const initLoginPage = () => {
        if (currentUser) {
            window.location.href = 'perfil.php';
            return;
        }

        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");

        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const username = document.getElementById("login-username").value;
                const password = document.getElementById("login-password").value;
                const errorMsg = document.getElementById("login-error");

                errorMsg.classList.add("hidden");

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: username, password: password })
                    });

                    const result = await response.json();

                    if (result.success) {
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

        if (registerForm) {
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
>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280
    const initProfilePage = () => {
        const container = document.getElementById("profile-page-container");
        if (!currentUser) {
            window.location.href = 'login.php';
            return;
        }
<<<<<<< HEAD
        // Se um admin aceder a perfil.php por engano, redireciona-o para o painel correto.
        if (currentUser.is_admin == 1) {
            window.location.href = 'painel_admin.php';
            return;
        }
        // Renderiza o perfil do utilizador normal
=======

>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280
        container.innerHTML = `
            <h1>Olá, ${currentUser.nome_completo.split(' ')[0]}</h1>
            <div class="profile-info">
                <p><strong>Nome:</strong> ${currentUser.nome_completo}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
            </div>
            <button id="logout-btn" class="btn-primary btn-danger">Sair da Conta</button>`;
        document.getElementById("logout-btn").addEventListener("click", clearCurrentUser);
    };

// --- PÁGINA DO PAINEL DO ADMINISTRADOR ---
const initAdminPanelPage = () => {
    const addProductForm = document.getElementById("add-product-form");
    const manageProductsList = document.getElementById("manage-products-list");

    // Ativa o botão de logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", clearCurrentUser);

    // --- LÓGICA PARA CARREGAR E GERIR PRODUTOS ---
    const loadAndRenderProducts = async () => {
        if (!manageProductsList) return;
        
        // Busca os produtos usando a função que já existe
        const products = await fetchProducts(); // Reutilizamos a função fetchProducts
        
        if (products.length > 0) {
            manageProductsList.innerHTML = products.map(product => `
                <div class="admin-product-item" id="product-item-${product.id}">
                    <img src="${product.imagem_principal}" alt="${product.nome}">
                    <div class="admin-product-info">
                        <strong>${product.nome}</strong>
                        <span>(ID: ${product.id})</span>
                    </div>
                    <button class="btn-danger remove-product-btn" data-product-id="${product.id}">Remover</button>
                </div>
            `).join('');
        } else {
            manageProductsList.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        }

        // Adiciona os event listeners para os novos botões de remover
        document.querySelectorAll('.remove-product-btn').forEach(button => {
            button.addEventListener('click', handleDeleteProduct);
        });
    };

    // --- FUNÇÃO PARA LIDAR COM A REMOÇÃO DE PRODUTOS ---
    const handleDeleteProduct = async (e) => {
        const productId = e.target.dataset.productId;
        
        // Confirmação para evitar acidentes
        if (!confirm(`Tem certeza que deseja remover o produto com ID ${productId}? Esta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/delete_product.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId })
            });
            const result = await response.json();

            if (result.success) {
                // Remove o produto da tela para feedback imediato
                const productElement = document.getElementById(`product-item-${productId}`);
                if (productElement) productElement.remove();
                alert(result.message); // Exibe a mensagem de sucesso
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert(`Erro ao remover produto: ${error.message}`);
        }
    };

    // --- LÓGICA PARA ADICIONAR PRODUTOS (JÁ EXISTENTE) ---
    if (addProductForm) {
        addProductForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            // ... (o seu código para adicionar produtos continua aqui, sem alterações)
            const successMsg = document.getElementById("admin-success");
            const errorMsg = document.getElementById("admin-error");
            
            const productData = {
                nome: document.getElementById("prod-nome").value,
                descricao: document.getElementById("prod-descricao").value,
                preco: document.getElementById("prod-preco").value,
                estoque: document.getElementById("prod-estoque").value,
                categoria_id: document.getElementById("prod-categoria").value,
                imagem_principal: document.getElementById("prod-imagem").value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/products/add_product.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const result = await response.json();

                if (response.status === 403) {
                     throw new Error('Acesso negado. Por favor, faça login como administrador.');
                }
                if (result.success) {
                    successMsg.textContent = result.message;
                    successMsg.classList.remove("hidden");
                    errorMsg.classList.add("hidden");
                    addProductForm.reset();
                    loadAndRenderProducts(); // Recarrega a lista de produtos após adicionar um novo
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove("hidden");
                successMsg.classList.add("hidden");
            }
        });
    }

    // Carrega a lista de produtos assim que a página do painel é iniciada
    loadAndRenderProducts();
};

    // =================================================================
    // --- ROTEAMENTO E INICIALIZAÇÃO ---
    // =================================================================
    const init = () => {
        updateUserIcon();
        updateCartCount();
        lucide.createIcons();
        
<<<<<<< HEAD
        // Roteamento baseado no ID de um elemento principal da página
        if (document.getElementById("home-products-grid")) {  initHomePage();  }
        if (document.getElementById("shop-products-grid")) {  initShopPage();  }
        if (document.getElementById("product-detail-container")) {  initProductPage();  }
=======
        if (document.getElementById("home-products-grid")) initHomePage();
        if (document.getElementById("shop-products-grid")) initShopPage();
        if (document.getElementById("product-detail-container")) initProductPage();
>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280
        if (document.getElementById("login-form")) initLoginPage();
        if (document.getElementById("profile-page-container")) initProfilePage();
        // A nova rota para o painel de admin
        if (document.getElementById("add-product-form")) initAdminPanelPage();
        if (document.getElementById("carrinho-container")) { renderCartPage();}

<<<<<<< HEAD
        // Os seus outros event listeners globais continuam aqui...
=======
        document.body.addEventListener("click", (e) => {
            const target = e.target;
            
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

            if (target.matches('.remove-cart-item-btn')) {
                const itemIndex = parseInt(target.dataset.index, 10);
                cart.splice(itemIndex, 1);
                saveCart();
                updateCartCount();
                renderCartPage();
            }
        });
>>>>>>> 4da16e8c43a7ac2d06266618b7ea476815b0c280
    };

    init();
});