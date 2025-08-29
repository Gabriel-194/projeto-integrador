<?php
require_once('../connection.php');
header('Content-Type: application/json');

// Pega o termo de busca da URL (ex: ?term=camiseta)
$searchTerm = isset($_GET['term']) ? trim($_GET['term']) : '';

if (empty($searchTerm)) {
    echo json_encode([]); // Retorna um array vazio se não houver termo de busca
    exit;
}

// Prepara o termo de busca para a consulta SQL, adicionando wildcards (%)
$likeTerm = "%" . $searchTerm . "%";

// Busca produtos onde o nome ou a descrição correspondem ao termo de busca
$stmt = $conn->prepare("SELECT id, nome, preco, imagem_principal FROM produtos WHERE (nome LIKE ? OR descricao LIKE ?) AND ativo = TRUE");
$stmt->bind_param("ss", $likeTerm, $likeTerm);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);

$stmt->close();
$conn->close();
?>