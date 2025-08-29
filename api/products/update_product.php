<?php
require_once('../../connection.php');
header('Content-Type: application/json');

// Adicione aqui uma verificação de autenticação de administrador para proteger esta API
session_start();
 if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
     echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
     exit;
 }

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? 0;
$nome = $data['nome'] ?? '';
$descricao = $data['descricao'] ?? '';
$preco = $data['preco'] ?? 0;
// $ativo = $data['ativo'] ?? TRUE; // Futuramente, você pode adicionar esta linha para editar o status de ativo/inativo

if ($id <= 0 || empty($nome) || $preco <= 0) {
    echo json_encode(['success' => false, 'message' => 'Dados do produto inválidos ou incompletos.']);
    exit;
}

// --- ALTERAÇÃO: Você pode adicionar 'ativo = ?' se quiser editar o status ---
$stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?");
// Se adicionar 'ativo', o bind_param seria "ssdbi", com $ativo como boolean (b)
$stmt->bind_param("ssdi", $nome, $descricao, $preco, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o produto.']);
}

$stmt->close();
$conn->close();
?>