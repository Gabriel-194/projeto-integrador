<?php
// api/products/recover_product.php
require_once('../../connection.php');
header('Content-Type: application/json');

// Medida de segurança básica para admin
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['id'] ?? 0;

if ($productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
    exit;
}

// Reativa o produto (exclusão lógica reversa)
$stmt = $conn->prepare("UPDATE produtos SET ativo = TRUE WHERE id = ?");
$stmt->bind_param("i", $productId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Produto reativado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nenhum produto inativo encontrado com este ID.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao reativar o produto.']);
}

$stmt->close();
$conn->close();
?>