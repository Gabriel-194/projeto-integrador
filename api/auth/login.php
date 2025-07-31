<?php
require_once('../../connection.php');
header('Content-Type: application/json');

session_start(); // Inicia a sessão no servidor

$data = json_decode(file_get_contents('php://input'), true);

// --- ALTERAÇÃO 1: Mudar de 'email' para 'username' ---
// Agora esperamos um campo 'username' vindo do JavaScript.
$username = $data['username'] ?? '';
$senha = $data['password'] ?? '';

if (empty($username) || empty($senha)) {
    // Mensagem de erro atualizada.
    echo json_encode(['success' => false, 'message' => 'Nome de usuário e senha são obrigatórios.']);
    exit;
}

// --- ALTERAÇÃO 2: A consulta SQL agora busca por 'nome_completo' ---
// Trocamos "WHERE email = ?" por "WHERE nome_completo = ?".
$stmt = $conn->prepare("SELECT id, nome_completo, email, senha_hash FROM clientes WHERE nome_completo = ?");
$stmt->bind_param("s", $username); // Passamos a variável $username para a consulta.
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// A lógica de verificação da senha continua a mesma.
if ($user && password_verify($senha, $user['senha_hash'])) {
    // Login bem-sucedido!
    unset($user['senha_hash']);
    $_SESSION['user'] = $user;
    
    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!', 'user' => $user]);
} else {
    // Login falhou
    // Mensagem de erro atualizada.
    echo json_encode(['success' => false, 'message' => 'Nome de usuário ou senha inválidos.']);
}

$stmt->close();
$conn->close();
?>