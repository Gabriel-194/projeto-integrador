<?php
require_once('../connection.php');
header('Content-Type: application/json');

// Pega os dados enviados pelo JavaScript (formato JSON)
$data = json_decode(file_get_contents('php://input'), true);

$nome = $data['name'] ?? '';
$email = $data['email'] ?? '';
$senha = $data['password'] ?? '';

// Validação simples
if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios.']);
    exit;
}

// **SEGURANÇA:** Criptografa a senha antes de salvar.
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Prepara o SQL para evitar ataques de SQL Injection
$stmt = $conn->prepare("INSERT INTO clientes (nome_completo, email, senha_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nome, $email, $senha_hash);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso!']);
} else {
    // Verifica se o erro é de e-mail duplicado
    if ($conn->errno == 1062) {
        echo json_encode(['success' => false, 'message' => 'Este e-mail já está cadastrado.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao realizar o cadastro.']);
    }
}

$stmt->close();
$conn->close();
?>