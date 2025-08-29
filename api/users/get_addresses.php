<?php
require_once('../../connection.php');
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$cliente_id = $_SESSION['user']['id'];

$stmt = $conn->prepare("SELECT id, logradouro, numero, bairro, cidade, estado, cep FROM enderecos WHERE cliente_id = ?");
$stmt->bind_param("i", $cliente_id);
$stmt->execute();
$result = $stmt->get_result();

$addresses = [];
while ($row = $result->fetch_assoc()) {
    $addresses[] = $row;
}

echo json_encode(['success' => true, 'data' => $addresses]);

$stmt->close();
$conn->close();
?>