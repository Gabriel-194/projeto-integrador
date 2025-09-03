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

    const showLoginRequiredModal = () => {
        const existingModal = document.getElementById('login-required-modal');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'login-required-modal';
        modalOverlay.className = 'custom-modal-overlay open';
        
        modalOverlay.innerHTML = `
            <div class="custom-modal">
                <h3>Login Necessário</h3>
                <p>Você precisa estar logado para adicionar produtos ao carrinho.</p>
                <div class="modal-actions">
                    <button id="modal-go-to-login" class="btn-primary">Ir para Login</button>
                    <button id="modal-close-btn" class="btn-secondary">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);

        document.getElementById('modal-go-to-login').addEventListener('click', () => {
            window.location.href = 'login.php';
        });
        
        const closeModal = () => modalOverlay.remove();
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    };

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
    
    const initBanner = () => {
        const slides = document.querySelectorAll(".banner-slide");
        if (slides.length < 2) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        };
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 3000);
    };

    const initSearch = () => {
        const searchOverlay = document.getElementById('search-overlay');
        if (!searchOverlay) return;

        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results-container');
        const openSearchButtons = document.querySelectorAll('button[aria-label="Pesquisar"]');
        const closeSearchBtn = document.getElementById('search-close-btn');

        const openSearch = () => searchOverlay.classList.add('open');
        const closeSearch = () => searchOverlay.classList.remove('open');

        openSearchButtons.forEach(btn => btn.addEventListener('click', openSearch));
        if(closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
        
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
        
        let searchTimeout;
        if(searchInput){
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                const searchTerm = searchInput.value.trim();

                if (searchTerm.length < 2) {
                    resultsContainer.innerHTML = '<p class="search-no-results">Digite pelo menos 2 caracteres.</p>';
                    return;
                }

                resultsContainer.innerHTML = '<p class="search-no-results">Buscando...</p>';

                searchTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/search_products.php?term=${encodeURIComponent(searchTerm)}`);
                        const products = await response.json();
                        
                        if (products.length > 0) {
                             resultsContainer.innerHTML = `<div class="products-grid">${products.map(createProductCard).join('')}</div>`;
                        } else {
                             resultsContainer.innerHTML = `<p class="search-no-results">Nenhum produto encontrado para "<strong>${searchTerm}</strong>".</p>`;
                        }
                    } catch (error) {
                        console.error('Erro na busca:', error);
                        resultsContainer.innerHTML = '<p class="search-no-results">Ocorreu um erro ao buscar.</p>';
                    }
                }, 300);
            });
        }
    };
    
    const initHomePage = async () => {
        initBanner();
        const homeGrid = document.getElementById("home-products-grid");
        if (homeGrid) {
            homeGrid.innerHTML = "<p>Carregando lançamentos...</p>";
            const allProducts = await fetchProducts();
            renderProducts(homeGrid, allProducts.slice(0, 4));
        }
    };

    const initShopPage = async () => {
        const shopGrid = document.getElementById("shop-products-grid");
        const filterButtons = document.querySelectorAll(".filter-btn");

        if (shopGrid) {
            shopGrid.innerHTML = "<p>Carregando todos os produtos...</p>";
            const allProducts = await fetchProducts();
            renderProducts(shopGrid, allProducts);

            const filterProducts = (category) => {
                const filtered = (category === "Todos") ? allProducts : allProducts.filter(p => p.categoria === category);
                renderProducts(shopGrid, filtered);
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
 
    const initProductPage = async () => {
        const container = document.getElementById("product-detail-container");
        if (!container) return;
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
            container.innerHTML = `<p>Erro ao carregar produto: ${error.message} <a href="loja.php">Voltar</a>.</p>`;
        }
    };

    const initLoginPage = () => {
        if (currentUser) {
            window.location.href = 'perfil.php';
            return;
        }

        const loginForm = document.getElementById("login-form");
        if (!loginForm) return;

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
                    window.location.href = result.user.role === 'admin' ? 'admin.php' : 'perfil.php';
                } else {
                    throw new Error(result.message || "Erro desconhecido.");
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove("hidden");
            }
        });
    };
    
    // O register.php agora tem o seu próprio script, esta função não é mais necessária aqui
    // const initRegisterPage = () => { ... }

    const initProfilePage = () => {
        const container = document.getElementById("profile-page-container");
        if (!container) return;
        
        if (!currentUser) {
            window.location.href = 'login.php';
            return;
        }

        // --- CÓDIGO CORRIGIDO E MAIS SEGURO ---
        // Ele verifica se 'nome_completo' existe antes de tentar usar o 'split'.
        const nomeCompleto = currentUser.nome_completo || 'Utilizador';
        const primeiroNome = nomeCompleto.split(' ')[0];

        const formatPrice = (price) => `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`;

        container.innerHTML = `
            <h1>Minha Conta</h1>
            <div class="profile-grid">
                <div class="profile-card">
                    <h2>Meus Dados</h2>
                    <p><strong>Nome:</strong> ${currentUser.nome_completo || 'Não informado'}</p>
                    <p><strong>Email:</strong> ${currentUser.email || 'Não informado'}</p>
                    <p><strong>CPF:</strong> ${currentUser.cpf || 'Não informado'}</p>
                    <button id="logout-btn" class="btn-primary btn-danger">Sair da Conta</button>
                </div>
                <div class="order-history">
                    <h2>Histórico de Pedidos</h2>
                    <div id="order-history-list" class="order-history-list">
                        <p>A carregar histórico...</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("logout-btn").addEventListener("click", handleLogout);

        const fetchOrderHistory = async () => {
            const orderListContainer = document.getElementById("order-history-list");
            try {
                const response = await fetch('api/users/get_order_history.php');
                const result = await response.json();

                if (result.success && result.data.length > 0) {
                    orderListContainer.innerHTML = result.data.map(order => `
                        <div class="order-card">
                            <div class="order-header">
                                <div><strong>Pedido #${order.id}</strong><br><small>${order.data_formatada}</small></div>
                                <div><strong>Total: ${formatPrice(order.valor_total)}</strong><br><small>Status: ${order.status_pedido}</small></div>
                            </div>
                            <div class="order-items">
                                ${order.itens.map(item => `
                                    <div class="order-item">
                                        <img src="${item.imagem_principal}" alt="${item.nome}">
                                        <div class="order-item-details">
                                            <p>${item.nome}</p>
                                            <span>${item.quantidade} x ${formatPrice(item.preco_unitario)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');
                } else if (result.success && result.data.length === 0) {
                    orderListContainer.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
                } else {
                    throw new Error(result.message || "Não foi possível carregar o histórico.");
                }
            } catch (error) {
                orderListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            }
        };

        fetchOrderHistory();
    };


    const renderCartPage = () => {
        const container = document.getElementById("carrinho-container");
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `<div class="cart-empty"><h2>Seu carrinho está vazio.</h2><a href="loja.php" class="btn-primary">Continuar comprando</a></div>`;
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
                    <button class="remove-cart-item-btn" data-index="${index}" style="background:none;border:none;color:red;text-decoration:underline;cursor:pointer;">Remover</button>
                </div>
            </div>`).join("");
        
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        
        container.innerHTML = `
            <h2>Seu Carrinho</h2>
            <div class="cart-items-list">${cartItemsHTML}</div>
            <div class="cart-summary">
                <h3>Total: ${formatPrice(totalPrice)}</h3>
                <a href="checkout.php" class="btn-primary">Finalizar Compra</a>
            </div>`;
    };

    const initCheckoutPage = () => {
        const container = document.getElementById('checkout-container');
        if (!container) return;
        if (!currentUser) {
            window.location.href = 'login.php';
            return;
        }
        if (cart.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio. Redirecionando...</p>';
            setTimeout(() => window.location.href = 'loja.php', 2000);
            return;
        }

        const renderCheckout = (addresses) => {
            const cartSummaryHTML = cart.map(item => `
                <div class="summary-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="summary-item-details">
                        <p>${item.name}</p>
                        <span>${item.quantity} x ${formatPrice(item.price)}</span>
                    </div>
                </div>`).join('');

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const addressesHTML = addresses.length > 0 ? addresses.map((addr, index) => `
                <label class="address-option">
                    <input type="radio" name="address" value="${addr.id}" ${index === 0 ? 'checked' : ''}>
                    <div>
                        <strong>${addr.logradouro}, ${addr.numero}</strong><br>
                        ${addr.bairro}, ${addr.cidade} - ${addr.estado}<br>
                        CEP: ${addr.cep}
                    </div>
                </label>`).join('') : '<p>Nenhum endereço cadastrado. <a href="perfil.php">Adicionar</a></p>';

            container.innerHTML = `
                <div class="checkout-layout">
                    <div class="checkout-details">
                        <h3>Endereço de Entrega</h3>
                        <div class="address-selection">${addressesHTML}</div>
                    </div>
                    <div class="checkout-summary">
                        <h3>Resumo do Pedido</h3>
                        <div class="summary-items">${cartSummaryHTML}</div>
                        <div class="summary-total">
                            <strong>Total:</strong>
                            <strong>${formatPrice(total)}</strong>
                        </div>
                        <button id="place-order-btn" class="btn-primary" ${addresses.length === 0 ? 'disabled' : ''}>Finalizar Pedido</button>
                    </div>
                </div>`;
        };

        fetch(`${API_BASE_URL}/users/get_addresses.php`)
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    renderCheckout(result.data);
                    const placeOrderBtn = document.getElementById('place-order-btn');
                    if (placeOrderBtn) {
                        placeOrderBtn.addEventListener('click', async () => {
                            const selectedAddress = document.querySelector('input[name="address"]:checked');
                            if (!selectedAddress) {
                                alert('Selecione um endereço.');
                                return;
                            }

                            placeOrderBtn.disabled = true;
                            placeOrderBtn.textContent = 'Processando...';

                            const response = await fetch(`${API_BASE_URL}/orders/create_order.php`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    address_id: selectedAddress.value,
                                    cart: cart
                                })
                            });
                            const orderResult = await response.json();

                            if (orderResult.success) {
                                cart = [];
                                saveCart();
                                updateCartCount();
                                window.location.href = 'confirmation.php';
                            } else {
                                alert('Erro: ' + orderResult.message);
                                placeOrderBtn.disabled = false;
                                placeOrderBtn.textContent = 'Finalizar Pedido';
                            }
                        });
                    }
                }
            });
        };
        
    const init = () => {
        updateUserIcon();
        updateCartCount();
        lucide.createIcons();
        initSearch();
        
        if (document.getElementById("home-products-grid")) initHomePage();
        if (document.getElementById("shop-products-grid")) initShopPage();
        if (document.getElementById("product-detail-container")) initProductPage();
        if (document.getElementById("login-form")) initLoginPage();
        // A função initRegisterPage foi removida daqui porque o register.php agora tem o seu próprio script.
        if (document.getElementById("profile-page-container")) initProfilePage();
        if (document.getElementById("carrinho-container")) renderCartPage();
        if (document.getElementById("checkout-container")) initCheckoutPage();

        document.body.addEventListener("click", (e) => {
            const target = e.target;
            
            if (target.matches('.add-cart-btn')) {
                e.preventDefault();
                if (!currentUser) {
                    showLoginRequiredModal();
                    return; 
                }
                
                const productId = target.dataset.productId;
                const existingItem = cart.find(item => item.productId === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        productId,
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
    };

    init();
});