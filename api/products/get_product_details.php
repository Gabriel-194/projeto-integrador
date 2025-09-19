<?php
require_once('../../connection.php');
header('Content-Type: application/json');

$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
    exit;
}

// Busca os detalhes do produto principal
$stmt = $conn->prepare("SELECT id, nome, descricao, preco, estoque, imagem_principal, tipo_produto FROM produtos WHERE id = ?");
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if ($product) {
    // Busca os tamanhos associados ao produto
    $stmt_tamanhos = $conn->prepare(
        "SELECT t.valor FROM tamanhos t
         JOIN produto_tamanhos pt ON t.id = pt.tamanho_id
         WHERE pt.produto_id = ?
         ORDER BY t.ordem ASC"
    );
    $stmt_tamanhos->bind_param("i", $productId);
    $stmt_tamanhos->execute();
    $result_tamanhos = $stmt_tamanhos->get_result();
    
    $tamanhos = [];
    while($row = $result_tamanhos->fetch_assoc()) {
        $tamanhos[] = $row['valor'];
    }
    
    $product['tamanhos'] = $tamanhos; // Adiciona o array de tamanhos ao produto
    
    echo json_encode(['success' => true, 'data' => $product]);
} else {
    echo json_encode(['success' => false, 'message' => 'Produto não encontrado.']);
}

$stmt->close();
$conn->close();
?>