document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAÇÕES GLOBAIS ---
    const API_BASE_URL = 'api';

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
                }
            });
        }
        // A lógica do registerForm continua igual...
    };

    // --- PÁGINA DE PERFIL NORMAL ---
    const initProfilePage = () => {
        const container = document.getElementById("profile-page-container");
        if (!currentUser) {
            window.location.href = 'login.php';
            return;
        }
        // Se um admin aceder a perfil.php por engano, redireciona-o para o painel correto.
        if (currentUser.is_admin == 1) {
            window.location.href = 'painel_admin.php';
            return;
        }
        // Renderiza o perfil do utilizador normal
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
        
        // Roteamento baseado no ID de um elemento principal da página
        if (document.getElementById("home-products-grid")) {  initHomePage();  }
        if (document.getElementById("shop-products-grid")) {  initShopPage();  }
        if (document.getElementById("product-detail-container")) {  initProductPage();  }
        if (document.getElementById("login-form")) initLoginPage();
        if (document.getElementById("profile-page-container")) initProfilePage();
        // A nova rota para o painel de admin
        if (document.getElementById("add-product-form")) initAdminPanelPage();
        if (document.getElementById("carrinho-container")) { renderCartPage();}

        // Os seus outros event listeners globais continuam aqui...
    };

    init();
});