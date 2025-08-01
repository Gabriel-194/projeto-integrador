<?php
require_once('../../connection.php');
header('Content-Type: application/json');
session_start();

// --- Passo de Segurança Crucial ---
// Verifica se o utilizador está logado E se ele é um administrador.
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
    // Se não for admin, nega o acesso.
    http_response_code(403); // Código de 'Acesso Proibido'
    echo json_encode(['success' => false, 'message' => 'Acesso negado. Apenas administradores.']);
    exit;
}

// Pega os dados do produto enviados pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

$nome = $data['nome'] ?? '';
$descricao = $data['descricao'] ?? '';
$preco = $data['preco'] ?? 0;
$estoque = $data['estoque'] ?? 0;
$categoria_id = $data['categoria_id'] ?? 0;
$imagem_principal = $data['imagem_principal'] ?? '';

// Validação simples
if (empty($nome) || empty($preco) || empty($categoria_id) || empty($imagem_principal)) {
    echo json_encode(['success' => false, 'message' => 'Nome, Preço, ID da Categoria e Imagem são obrigatórios.']);
    exit;
}

// Prepara o SQL para inserir o novo produto
$stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, imagem_principal) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiis", $nome, $descricao, $preco, $estoque, $categoria_id, $imagem_principal);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto adicionado com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao adicionar o produto: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>