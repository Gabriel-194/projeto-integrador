<?php
// Inclui a conexão com o banco de dados
require_once('../connection.php');

// Define que a resposta será no formato JSON
header('Content-Type: application/json');

// Usando LEFT JOIN para garantir que todos os produtos apareçam,
// mesmo que uma categoria seja inválida.
$sql = "SELECT 
            p.id, 
            p.nome, 
            p.preco, 
            p.imagem_principal, 
            c.nome AS categoria 
        FROM 
            produtos p 
        LEFT JOIN 
            categorias c ON p.categoria_id = c.id";

$result = $conn->query($sql);

$products = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);

$conn->close();
?>