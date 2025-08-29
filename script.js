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
        // Remove qualquer modal antigo para não duplicar
        const existingModal = document.getElementById('login-required-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Cria a estrutura do modal
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

        // Adiciona os eventos para os botões do novo modal
        document.getElementById('modal-go-to-login').addEventListener('click', () => {
            window.location.href = 'login.php';
        });
        
        const closeModal = () => modalOverlay.remove();
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
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

    const initSearch = () => {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results-container');
        const openSearchButtons = document.querySelectorAll('button[aria-label="Pesquisar"]');
        const closeSearchBtn = document.getElementById('search-close-btn');

        if (!searchOverlay) return;

        const openSearch = () => searchOverlay.classList.add('open');
        const closeSearch = () => searchOverlay.classList.remove('open');

        openSearchButtons.forEach(btn => btn.addEventListener('click', openSearch));
        closeSearchBtn.addEventListener('click', closeSearch);
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
        
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            const searchTerm = searchInput.value.trim();

            if (searchTerm.length < 2) {
                resultsContainer.innerHTML = '<p class="search-no-results">Digite pelo menos 2 caracteres para buscar.</p>';
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
                    resultsContainer.innerHTML = '<p class="search-no-results">Ocorreu um erro ao realizar a busca.</p>';
                }
            }, 300); // Espera 300ms após o usuário parar de digitar
        });
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
                        // --- VERIFICAÇÃO DE ROLE E REDIRECIONAMENTO ---
                        if (result.user.role === 'admin') {
                            window.location.href = 'admin.php'; // Redireciona para o painel de admin
                        } else {
                            window.location.href = 'perfil.php'; // Redireciona para o perfil normal
                        }
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
                    const response = await fetch(`${API_BASE_URL}/register.php`, {
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
                <a href="checkout.php" class="btn-primary">Finalizar Compra</a>
            </div>`;
    };

    // =================================================================
    // --- INICIALIZAÇÃO E EVENT LISTENERS GLOBAIS ---
    // =================================================================
    // --- PÁGINA DE CHECKOUT ---
const initCheckoutPage = () => {
    const container = document.getElementById('checkout-container');
    if (!container) return;

    if (!currentUser) {
        window.location.href = 'login.php';
        return;
    }
    if (cart.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio. Redirecionando para a loja...</p>';
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
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const addressesHTML = addresses.length > 0 ? addresses.map((addr, index) => `
            <label class="address-option">
                <input type="radio" name="address" value="${addr.id}" ${index === 0 ? 'checked' : ''}>
                <div>
                    <strong>${addr.logradouro}, ${addr.numero}</strong><br>
                    ${addr.bairro}, ${addr.cidade} - ${addr.estado}<br>
                    CEP: ${addr.cep}
                </div>
            </label>
        `).join('') : '<p>Nenhum endereço cadastrado. <a href="perfil.php">Adicionar endereço</a></p>';

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
            </div>
        `;
    };

    // Busca os endereços e renderiza a página
    fetch(`${API_BASE_URL}/users/get_addresses.php`)
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                renderCheckout(result.data);

                const placeOrderBtn = document.getElementById('place-order-btn');
                placeOrderBtn.addEventListener('click', async () => {
                    const selectedAddress = document.querySelector('input[name="address"]:checked');
                    if (!selectedAddress) {
                        alert('Por favor, selecione um endereço de entrega.');
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
                        cart = []; // Limpa o carrinho
                        saveCart();
                        updateCartCount();
                        window.location.href = 'order_confirmation.php';
                    } else {
                        alert('Erro ao finalizar o pedido: ' + orderResult.message);
                        placeOrderBtn.disabled = false;
                        placeOrderBtn.textContent = 'Finalizar Pedido';
                    }
                });
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
        if (document.getElementById("profile-page-container")) initProfilePage();
        if (document.getElementById("carrinho-container")) renderCartPage();
        if (document.getElementById("checkout-container")) initCheckoutPage();

        document.body.addEventListener("click", (e) => {
            const target = e.target;
            
            if (target.matches('.add-cart-btn')) {
                e.preventDefault();

                // --- VERIFICAÇÃO DE LOGIN (NOVO) ---
                if (!currentUser) {
                    showLoginRequiredModal();
                    return; // Para a execução aqui se o usuário não estiver logado
                }
                // --- FIM DA VERIFICAÇÃO ---

                // O código abaixo só será executado se o usuário estiver logado
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
    };

    init();
});