<?php
// api/products/get_related_products.php
require_once('../../connection.php');
header('Content-Type: application/json');

$categoria_id = isset($_GET['categoria_id']) ? (int)$_GET['categoria_id'] : 0;
$produto_id_atual = isset($_GET['produto_id']) ? (int)$_GET['produto_id'] : 0;

if ($categoria_id <= 0 || $produto_id_atual <= 0) {
    echo json_encode([]);
    exit;
}

// ALTERAÇÃO: Mude o LIMIT para 10
$stmt = $conn->prepare(
    "SELECT id, nome, preco, imagem_principal FROM produtos 
     WHERE categoria_id = ? AND id != ? AND ativo = TRUE 
     ORDER BY RAND() 
     LIMIT 10" // <-- ALTERADO AQUI
);
$stmt->bind_param("ii", $categoria_id, $produto_id_atual);
$stmt->execute();
$result = $stmt->get_result();

$related_products = [];
if ($result) {
    $related_products = $result->fetch_all(MYSQLI_ASSOC);
}

echo json_encode($related_products);

$stmt->close();
$conn->close();
?>