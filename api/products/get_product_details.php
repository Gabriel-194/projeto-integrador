<?php
require_once('../../connection.php');
header('Content-Type: application/json');

// Pega o ID do produto da URL (ex: ?id=4)
$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
    exit;
}

// Busca os detalhes do produto específico
$stmt = $conn->prepare("SELECT id, nome, descricao, preco, estoque, imagem_principal FROM produtos WHERE id = ?");
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if ($product) {
    // No futuro, você pode adicionar aqui a busca por imagens adicionais ou avaliações
    echo json_encode(['success' => true, 'data' => $product]);
} else {
    echo json_encode(['success' => false, 'message' => 'Produto não encontrado.']);
}

$stmt->close();
$conn->close();
?>