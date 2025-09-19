<?php
session_start();
require_once('connection.php');

// Segurança: Apenas administradores podem acessar
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Busca de dados (categorias e tamanhos)
$categorias = [];
$todos_os_tamanhos = [];
try {
    $result_categorias = $conn->query("SELECT id, nome FROM categorias ORDER BY nome ASC");
    if ($result_categorias) $categorias = $result_categorias->fetch_all(MYSQLI_ASSOC);

    $result_tamanhos = $conn->query("SELECT id, valor, tipo FROM tamanhos ORDER BY tipo, ordem ASC");
    if ($result_tamanhos) $todos_os_tamanhos = $result_tamanhos->fetch_all(MYSQLI_ASSOC);
} catch (Exception $e) {
    die("Erro fatal ao buscar dados do banco de dados: " . $e->getMessage());
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Administrador | Essence Wear</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @media (min-width: 768px) {
        .custom-modal {
            max-width: 700px;
        }
}
        .size-button-group { display: flex; flex-wrap: wrap; gap: 0.75rem; border: 1px solid #e5e5e5; padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem; min-height: 50px; }
        .size-button-group input[type="checkbox"] { display: none; }
        .size-button-group label { display: inline-block; padding: 0.5rem 1.25rem; border: 2px solid #e5e5e5; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s ease; font-weight: 500; }
        .size-button-group input[type="checkbox"]:checked + label { background-color: #0a0a0a; color: #ffffff; border-color: #0a0a0a; }
        .admin-product-card.inactive { opacity: 0.6; }
        .admin-product-card.inactive .admin-product-img { filter: grayscale(80%); }
        .btn-recover { color: #16a34a; }
        .btn-recover:hover { background-color: #f0fdf4; }
        .admin-toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-container">
                <a href="admin.php" class="mobile-menu-logo header-element">ESSENCE ADMIN</a>
                <div class="header-actions" style="display: flex; align-items: center; gap: 1rem;">
                    <a href="index.php" class="btn-secondary">Ver Loja</a>
                    <button id="logout-btn-admin" class="btn-primary btn-danger">Sair da Conta</button>
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="admin-page container">
            <div class="admin-header">
                <div><h1>Gerenciamento de Produtos</h1><p>Adicione, edite ou remova produtos do catálogo.</p></div>
                <button class="btn-primary add-product-btn"><i data-lucide="plus"></i> Adicionar Produto</button>
            </div>
            <div class="admin-toolbar">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="show-inactive-checkbox">
                    Mostrar produtos inativos
                </label>
            </div>
            <div id="admin-product-list" class="admin-product-grid"><p>Carregando produtos...</p></div>
        </div>
    </main>

    <div id="add-modal-overlay" class="custom-modal-overlay">
        <div class="custom-modal">
            <h3>Adicionar Novo Produto</h3>
            <form id="add-product-form" class="auth-form" enctype="multipart/form-data">
                <div class="form-group"><label for="add-product-name">Nome</label><input type="text" id="add-product-name" name="nome" required></div>
                <div class="form-group"><label for="add-product-description">Descrição</label><textarea id="add-product-description" name="descricao" rows="4"></textarea></div>
                <div class="form-group"><label for="add-product-price">Preço (R$)</label><input type="number" step="0.01" id="add-product-price" name="preco" required></div>
                <div class="form-group"><label for="add-product-image">Imagem</label><input type="file" id="add-product-image" name="imagem_principal" accept="image/*" required></div>
                <div class="form-group">
                    <label for="add-product-category">Categoria</label>
                    <select id="add-product-category" name="categoria_id" required>
                        <option value="">Selecione</option>
                        <?php foreach ($categorias as $categoria): ?>
                            <option value="<?php echo htmlspecialchars($categoria['id']); ?>"><?php echo htmlspecialchars($categoria['nome']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="add-product-type">Tipo de Produto</label>
                    <select id="add-product-type" name="tipo_produto" required><option value="Roupa" selected>Roupa</option><option value="Calcado">Calçado</option></select>
                </div>
                <div class="form-group">
                    <label>Tamanhos</label>
                    <div id="add-product-sizes-container" class="size-button-group"></div>
                </div>
                <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" id="cancel-add-btn" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Adicionar</button>
                </div>
            </form>
        </div>
    </div>

    <footer class="footer"><div class="container"><p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p></div></footer>
    
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const allSizes = <?php echo json_encode($todos_os_tamanhos); ?>;
        
        const productListContainer = document.getElementById('admin-product-list');
        const showInactiveCheckbox = document.getElementById('show-inactive-checkbox');
        const addProductBtn = document.querySelector('.add-product-btn');
        const addModalOverlay = document.getElementById('add-modal-overlay');
        const addForm = document.getElementById('add-product-form');
        const cancelAddBtn = document.getElementById('cancel-add-btn');
        const productTypeSelect = document.getElementById('add-product-type');
        const sizesContainer = document.getElementById('add-product-sizes-container');
        const logoutButton = document.getElementById('logout-btn-admin');

        const openAddModal = () => { renderSizeButtons(productTypeSelect.value); addModalOverlay.classList.add('open'); };
        const closeAddModal = () => { addForm.reset(); addModalOverlay.classList.remove('open'); };

        const renderSizeButtons = (productType) => {
            const relevantSizes = allSizes.filter(size => size.tipo === productType);
            sizesContainer.innerHTML = relevantSizes.length > 0
                ? relevantSizes.map(size => `<div><input type="checkbox" name="tamanhos[]" value="${size.id}" id="s-${size.id}"><label for="s-${size.id}">${size.valor}</label></div>`).join('')
                : '<p>Nenhum tamanho encontrado.</p>';
        };

        const attachCardEventListeners = () => {
            document.querySelectorAll('.btn-delete, .btn-recover').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    const isRecovering = e.currentTarget.classList.contains('btn-recover');
                    const action = isRecovering ? 'REATIVAR' : 'DESATIVAR';
                    const endpoint = isRecovering ? 'recover_product.php' : 'delete_product.php';
                    if (!confirm(`Tem certeza que deseja ${action} o produto ID ${id}?`)) return;
                    try {
                        const response = await fetch(`api/products/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                        const result = await response.json();
                        if (result.success) await fetchAndRenderProducts(); else alert("Erro: " + result.message);
                    } catch (err) { alert("Erro de comunicação."); }
                });
            });
        };

        const fetchAndRenderProducts = async () => {
             try {
                const showAll = showInactiveCheckbox.checked;
                const response = await fetch(`api/get_products.php?show_all=${showAll}`);
                const products = await response.json();
                
                productListContainer.innerHTML = products.length > 0
                    ? products.map(p => {
                        const isInactive = !parseInt(p.ativo);
                        const actionButton = isInactive 
                            ? `<button class="btn-action btn-recover" data-id="${p.id}"><i data-lucide="check-circle"></i> Recuperar</button>`
                            : `<button class="btn-action btn-delete" data-id="${p.id}"><i data-lucide="trash-2"></i> Excluir</button>`;
                        return `
                        <div class="admin-product-card ${isInactive ? 'inactive' : ''}">
                            <div class="card-image-container"><img src="${p.imagem_principal}" alt="${p.nome}" class="admin-product-img"></div>
                            <div class="card-content">
                                <h3>${p.nome} ${isInactive ? '(Inativo)' : ''}</h3>
                                <p class="product-price">R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div class="card-actions">
                                <button class="btn-action btn-edit" data-id="${p.id}"><i data-lucide="pencil"></i> Editar</button>
                                ${actionButton}
                            </div>
                        </div>`;
                    }).join('')
                    : '<p>Nenhum produto encontrado.</p>';
                
                lucide.createIcons();
                attachCardEventListeners();
             } catch (e) {
                productListContainer.innerHTML = `<p>Ocorreu um erro ao carregar os produtos.</p>`;
                console.error(e);
             }
        };
        
        // --- EVENT LISTENERS ---
        addProductBtn.addEventListener('click', openAddModal);
        cancelAddBtn.addEventListener('click', closeAddModal);
        showInactiveCheckbox.addEventListener('change', fetchAndRenderProducts);
        productTypeSelect.addEventListener('change', () => renderSizeButtons(productTypeSelect.value));
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('essenceCurrentUser');
            window.location.href = 'index.php';
        });

        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = addForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            try {
                const response = await fetch('api/products/add_product.php', { method: 'POST', body: new FormData(addForm) });
                const result = await response.json();
                if (result.success) { closeAddModal(); await fetchAndRenderProducts(); }
                else { alert('Erro: ' + (result.message || 'Falha ao adicionar.')); }
            } catch (error) {
                alert('Erro de comunicação.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Adicionar';
            }
        });
        
        // --- INICIALIZAÇÃO ---
        fetchAndRenderProducts();
        lucide.createIcons();
    });
    </script>
</body>
</html>