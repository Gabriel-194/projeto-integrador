<?php
require_once('../../connection.php');
header('Content-Type: application/json');

session_start(); // Inicia a sessão no servidor

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Nome de usuário e senha são obrigatórios.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, nome_completo, email, senha_hash, role, cpf FROM clientes WHERE nome_completo = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$stmt->close();

// --- LÓGICA DE LOGIN ---

$login_success = false;

if ($user) {
    // NOVA LÓGICA: Verifica se é o login "mestre" do administrador
    if ($user['nome_completo'] === 'admin' && $password === 'admin1234' && $user['role'] === 'admin') {
        $login_success = true;
    } 
    // LÓGICA ANTIGA: Se não for o admin "mestre", verifica a senha criptografada normalmente
    else if (password_verify($password, $user['senha_hash'])) {
        $login_success = true;
    }
}

if ($login_success) {
    // Login bem-sucedido!
    unset($user['senha_hash']); // Remove a senha da resposta por segurança
    $_SESSION['user'] = $user;
    
    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!', 'user' => $user]);
} else {
    // Login falhou
    echo json_encode(['success' => false, 'message' => 'Nome de usuário ou senha inválidos.']);
}

$conn->close();
?>