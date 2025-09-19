<?php
// api/get_products.php
require_once('../connection.php');
header('Content-Type: application/json');

// Verifica se o admin quer ver TODOS os produtos (ativos e inativos)
$showAll = isset($_GET['show_all']) && $_GET['show_all'] === 'true';

// Monta a consulta SQL base
$sql = "SELECT
            p.id,
            p.nome,
            p.descricao,
            p.preco,
            p.imagem_principal,
            p.ativo, -- Importante: precisamos saber o status do produto
            c.nome AS categoria
        FROM
            produtos p
        LEFT JOIN
            categorias c ON p.categoria_id = c.id";

// Se não for para mostrar todos, adiciona a condição para pegar apenas os ativos
if (!$showAll) {
    $sql .= " WHERE p.ativo = TRUE";
}

$sql .= " ORDER BY p.id DESC";

$result = $conn->query($sql);

$products = [];
if ($result) {
    // Usamos fetch_all para uma sintaxe mais limpa
    $products = $result->fetch_all(MYSQLI_ASSOC);
}

echo json_encode($products);

$conn->close();
?>