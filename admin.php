<?php
// Futuramente, você pode adicionar uma verificação de sessão aqui para proteger a página
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Administrador | Essence Wear</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-container">
                <a href="index.php" class="mobile-menu-logo header-element">ESSENCE ADMIN</a>
                <div class="header-actions">
                    <button id="logout-btn-admin" class="btn-secondary">Sair</button>
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="admin-page container">
            <div class="admin-header">
                <div>
                    <h1>Gerenciamento de Produtos</h1>
                    <p>Adicione, edite ou remova produtos do catálogo.</p>
                </div>
                <button class="btn-primary add-product-btn">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Adicionar Produto
                </button>
            </div>
            
            <div id="admin-product-list" class="admin-product-grid">
                </div>
        </div>
    </main>

    <div id="add-modal-overlay" class="custom-modal-overlay">
    <div class="custom-modal">
        <h3>Adicionar Novo Produto</h3>
        <form id="add-product-form" class="auth-form">
            <div class="form-group">
                <label for="add-product-name">Nome do Produto</label>
                <input type="text" id="add-product-name" required>
            </div>
            <div class="form-group">
                <label for="add-product-description">Descrição</label>
                <textarea id="add-product-description" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="add-product-price">Preço (R$)</label>
                <input type="number" step="0.01" id="add-product-price" required>
            </div>
             <div class="form-group">
                <label for="add-product-image">URL da Imagem Principal</label>
                <input type="url" id="add-product-image" required>
            </div>
            <div class="form-group">
                <label for="add-product-category">Categoria</label>
                <select id="add-product-category" required>
                    <option value="">Carregando categorias...</option>
                </select>
            </div>
            <div class="modal-actions">
                <button type="submit" class="btn-primary">Adicionar Produto</button>
                <button type="button" id="cancel-add-btn" class="btn-secondary">Cancelar</button>
            </div>
        </form>
    </div>
    </div>
    
    <div id="edit-modal-overlay" class="custom-modal-overlay">
        <div class="custom-modal">
            <h3>Editar Produto</h3>
            <form id="edit-product-form" class="auth-form">
                <input type="hidden" id="edit-product-id">
                <div class="form-group">
                    <label for="edit-product-name">Nome do Produto</label>
                    <input type="text" id="edit-product-name" required>
                </div>
                <div class="form-group">
                    <label for="edit-product-description">Descrição</label>
                    <textarea id="edit-product-description" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-product-price">Preço (R$)</label>
                    <input type="number" step="0.01" id="edit-product-price" required>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">Salvar Alterações</button>
                    <button type="button" id="cancel-edit-btn" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>


    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
    </footer>
    
    <script src="script.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const addModalOverlay = document.getElementById('add-modal-overlay');
        const addProductBtn = document.querySelector('.add-product-btn');
        const addForm = document.getElementById('add-product-form');
        const cancelAddBtn = document.getElementById('cancel-add-btn');
        const productListContainer = document.getElementById('admin-product-list');
        const editModalOverlay = document.getElementById('edit-modal-overlay');
        const editForm = document.getElementById('edit-product-form');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        let allProducts = [];

        const formatPrice = (price) => `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`;
        
const openAddModal = async () => {
    const categorySelect = document.getElementById('add-product-category');
        categorySelect.innerHTML = '<option value="">Carregando categorias...</option>';
    try {
    const response = await fetch('api/get_categories.php');
    const categories = await response.json();
    if (categories.length > 0) {
        categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        categories.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
        });
    } else {
             categorySelect.innerHTML = '<option value="">Nenhuma categoria encontrada</option>';
    }
    } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    categorySelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
    addModalOverlay.classList.add('open');
};

const closeAddModal = () => {
    addForm.reset(); // Limpa o formulário
    addModalOverlay.classList.remove('open');
};

        const renderProducts = () => {
            if (allProducts.length === 0) {
                productListContainer.innerHTML = '<p>Nenhum produto cadastrado.</p>';
                return;
            }
            productListContainer.innerHTML = allProducts.map(p => `
                <div class="admin-product-card" data-product-id="${p.id}">
                    <div class="card-image-container">
                        <img src="${p.imagem_principal}" alt="${p.nome}" class="admin-product-img">
                    </div>
                    <div class="card-content">
                        <h3 class="product-name">${p.nome}</h3>
                        <p class="product-description">${(p.descricao || 'Sem descrição').substring(0, 80)}${p.descricao && p.descricao.length > 80 ? '...' : ''}</p>
                        <p class="product-price">${formatPrice(p.preco)}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" data-id="${p.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            Editar
                        </button>
                        <button class="btn-action btn-delete" data-id="${p.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            Excluir
                        </button>
                    </div>
                </div>
            `).join('');
        };

        const fetchAndRenderProducts = async () => {
            try {
                // Usaremos a API de produtos gerais, mas idealmente seria uma API de admin
                const response = await fetch('api/get_products.php?all=true'); // Futuramente, crie uma API que retorna até os inativos
                allProducts = await response.json();
                renderProducts();
            } catch (error) {
                productListContainer.innerHTML = '<p>Erro ao carregar os produtos.</p>';
                console.error(error);
            }
        };

        const handleDelete = async (productId) => {
            if (!confirm('Tem certeza que deseja DESATIVAR este produto? Ele não será mais exibido no site, mas poderá ser reativado posteriormente.')) {
                return;
            }
            try {
                const response = await fetch('api/products/delete_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: productId })
                });
                const result = await response.json();
                if (result.success) {
                    allProducts = allProducts.filter(p => p.id != productId);
                    renderProducts();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) {
                alert('Ocorreu um erro na comunicação com o servidor.');
            }
        };

        const openEditModal = (productId) => {
            const product = allProducts.find(p => p.id == productId);
            if(product) {
                document.getElementById('edit-product-id').value = product.id;
                document.getElementById('edit-product-name').value = product.nome;
                document.getElementById('edit-product-description').value = product.descricao || '';
                document.getElementById('edit-product-price').value = product.preco;
                editModalOverlay.classList.add('open');
            }
        };

        const closeEditModal = () => {
            editModalOverlay.classList.remove('open');
        };

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const productData = {
                id: document.getElementById('edit-product-id').value,
                nome: document.getElementById('edit-product-name').value,
                descricao: document.getElementById('edit-product-description').value,
                preco: document.getElementById('edit-product-price').value
            };
            
            try {
                const response = await fetch('api/products/update_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const result = await response.json();
                if (result.success) {
                    const index = allProducts.findIndex(p => p.id == productData.id);
                    if (index !== -1) {
                         allProducts[index].nome = productData.nome;
                         allProducts[index].descricao = productData.descricao;
                         allProducts[index].preco = productData.preco;
                    }
                    renderProducts();
                    closeEditModal();
                } else {
                    alert('Erro: ' + result.message);
                }
            } catch (error) {
                alert('Ocorreu um erro na comunicação com o servidor.');
            }
        });

        productListContainer.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.btn-action');
            if (targetButton) {
                if (targetButton.classList.contains('btn-delete')) {
                    handleDelete(targetButton.dataset.id);
                }
                if (targetButton.classList.contains('btn-edit')) {
                    openEditModal(targetButton.dataset.id);
                }
            }
        });

        cancelEditBtn.addEventListener('click', closeEditModal);
        
        const logoutBtnAdmin = document.getElementById('logout-btn-admin');
        if(logoutBtnAdmin) {
            logoutBtnAdmin.addEventListener('click', () => {
                sessionStorage.removeItem('essenceCurrentUser');
                window.location.href = 'index.php';
            });
        }

        addProductBtn.addEventListener('click', openAddModal);
cancelAddBtn.addEventListener('click', closeAddModal);

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productData = {
        nome: document.getElementById('add-product-name').value,
        descricao: document.getElementById('add-product-description').value,
        preco: document.getElementById('add-product-price').value,
        categoria_id: document.getElementById('add-product-category').value,
        imagem_principal: document.getElementById('add-product-image').value
    };

    try {
        const response = await fetch('api/products/add_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        const result = await response.json();

        if (result.success) {
            closeAddModal();
            fetchAndRenderProducts(); // Atualiza a lista de produtos
        } else {
            alert('Erro: ' + (result.message || 'Não foi possível adicionar o produto.'));
        }
    } catch (error) {
        alert('Ocorreu um erro na comunicação com o servidor.');
    }
});
        
        fetchAndRenderProducts();
});
    </script>
</body>
</html>