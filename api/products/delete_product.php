<?php
require_once('../../connection.php');
header('Content-Type: application/json');

// Adicione aqui uma verificação de autenticação de administrador para proteger esta API
// session_start();
// if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
//     echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
//     exit;
// }

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['id'] ?? 0;

if ($productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
    exit;
}

// --- ALTERAÇÃO: Exclusão lógica (define 'ativo' como FALSE) ---
$stmt = $conn->prepare("UPDATE produtos SET ativo = FALSE WHERE id = ?");
$stmt->bind_param("i", $productId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Produto desativado (excluído logicamente) com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nenhum produto ativo encontrado com este ID.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao desativar o produto.']);
}

$stmt->close();
$conn->close();
?>