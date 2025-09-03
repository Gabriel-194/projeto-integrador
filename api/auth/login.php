<?php
require_once('../../connection.php');
header('Content-Type: application/json');

session_start(); // Inicia a sessão no servidor

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$senha = $data['password'] ?? '';

if (empty($username) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Nome de usuário e senha são obrigatórios.']);
    exit;
}

// --- ALTERAÇÃO: A consulta agora também busca o CPF ---
$stmt = $conn->prepare("SELECT id, nome_completo, email, senha_hash, role, cpf FROM clientes WHERE nome_completo = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($senha, $user['senha_hash'])) {
    // Login bem-sucedido!
    unset($user['senha_hash']);
    $_SESSION['user'] = $user;
    
    // O 'role' e o 'cpf' do usuário agora estão incluídos na resposta
    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!', 'user' => $user]);
} else {
    // Login falhou
    echo json_encode(['success' => false, 'message' => 'Nome de usuário ou senha inválidos.']);
}

$stmt->close();
$conn->close();
?>