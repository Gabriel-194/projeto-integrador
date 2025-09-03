<?php
require_once('../../connection.php');
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$cliente_id = $_SESSION['user']['id'];

// Inicia uma transação para garantir a consistência dos dados
$conn->begin_transaction();

try {
    // Busca todos os pedidos do cliente
    $stmt_pedidos = $conn->prepare(
        "SELECT id, valor_total, status_pedido, DATE_FORMAT(data_pedido, '%d/%m/%Y às %H:%i') as data_formatada 
         FROM pedidos 
         WHERE cliente_id = ? 
         ORDER BY data_pedido DESC"
    );
    $stmt_pedidos->bind_param("i", $cliente_id);
    $stmt_pedidos->execute();
    $result_pedidos = $stmt_pedidos->get_result();

    $pedidos = [];
    while ($pedido = $result_pedidos->fetch_assoc()) {
        // Para cada pedido, busca os seus itens
        $stmt_itens = $conn->prepare(
            "SELECT ip.quantidade, ip.preco_unitario, p.nome, p.imagem_principal 
             FROM itens_pedido ip 
             JOIN produtos p ON ip.produto_id = p.id 
             WHERE ip.pedido_id = ?"
        );
        $stmt_itens->bind_param("i", $pedido['id']);
        $stmt_itens->execute();
        $result_itens = $stmt_itens->get_result();
        
        $itens = [];
        while ($item = $result_itens->fetch_assoc()) {
            $itens[] = $item;
        }
        $stmt_itens->close();
        
        $pedido['itens'] = $itens; // Adiciona a lista de itens ao pedido
        $pedidos[] = $pedido;
    }
    $stmt_pedidos->close();

    // Se tudo deu certo, confirma a transação
    $conn->commit();
    echo json_encode(['success' => true, 'data' => $pedidos]);

} catch (Exception $e) {
    // Se algo deu errado, desfaz a transação
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Erro ao buscar o histórico de pedidos.', 'error' => $e->getMessage()]);
}

$conn->close();
?>