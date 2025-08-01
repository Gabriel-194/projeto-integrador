<?php
require_once('../../connection.php');
header('Content-Type: application/json');
session_start();

// Segurança: Garante que apenas um administrador logado pode apagar produtos.
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
    http_response_code(403); // Acesso Proibido
    echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
    exit;
}

// Pega o ID do produto enviado pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['id'] ?? 0;

if ($productId <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
    exit;
}

// Prepara e executa o comando SQL para apagar o produto
$stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
$stmt->bind_param("i", $productId);

if ($stmt->execute()) {
    // Verifica se alguma linha foi realmente apagada
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Produto removido com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Produto não encontrado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao remover o produto: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>