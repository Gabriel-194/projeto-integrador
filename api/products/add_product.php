<?php
require_once('../../connection.php');
header('Content-Type: application/json');

// Futuramente, adicione uma verificação de segurança para garantir que apenas administradores podem adicionar produtos.

$data = json_decode(file_get_contents('php://input'), true);

$nome = $data['nome'] ?? '';
$descricao = $data['descricao'] ?? '';
$preco = $data['preco'] ?? 0;
$categoria_id = $data['categoria_id'] ?? 0;
$imagem_principal = $data['imagem_principal'] ?? '';

if (empty($nome) || $preco <= 0 || $categoria_id <= 0 || empty($imagem_principal)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios: Nome, Preço, Categoria e URL da Imagem.']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_principal) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdis", $nome, $descricao, $preco, $categoria_id, $imagem_principal);

if ($stmt->execute()) {
    $newProductId = $stmt->insert_id;
    echo json_encode(['success' => true, 'message' => 'Produto adicionado com sucesso!', 'new_product_id' => $newProductId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao adicionar o produto.']);
}

$stmt->close();
$conn->close();
?>