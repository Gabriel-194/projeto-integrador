<?php
// Inclui a conexão com o banco de dados
require_once('../connection.php');

// Define que a resposta será no formato JSON
header('Content-Type: application/json');

// --- ALTERAÇÃO: Usando LEFT JOIN para incluir o nome da categoria ---
// A consulta agora busca o nome da categoria (c.nome) e o renomeia para "categoria"
$sql = "SELECT 
            p.id, 
            p.nome, 
            p.descricao,
            p.preco, 
            p.imagem_principal, 
            c.nome AS categoria 
        FROM 
            produtos p 
        LEFT JOIN 
            categorias c ON p.categoria_id = c.id
        WHERE 
            p.ativo = TRUE";

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