<?php
require_once('../../connection.php');
header('Content-Type: application/json');

session_start();

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$senha = $data['password'] ?? '';

if (empty($username) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Nome de usuário e senha são obrigatórios.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, nome_completo, email, senha_hash, is_admin FROM clientes WHERE nome_completo = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
// Garante que os tipos de dados estão corretos antes de enviar ao JS
if ($user) {
    $user['id'] = (int)$user['id'];
    $user['is_admin'] = (int)$user['is_admin'];
}

// --- ALTERAÇÃO AQUI ---
// Trocamos a função segura 'password_verify' por uma comparação de strings simples '==='.
if ($user && $senha === $user['senha_hash']) {
    unset($user['senha_hash']); // Ainda é uma boa prática não enviar a senha de volta para o front-end.
    $_SESSION['user'] = $user;
    
    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!', 'user' => $user, 'debug_session' => $_SESSION]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nome de usuário ou senha inválidos.']);
}

$stmt->close();
$conn->close();
?>