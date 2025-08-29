<?php
require_once('../../connection.php');
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$cliente_id = $_SESSION['user']['id'];
$endereco_id = $data['address_id'] ?? 0;
$cart_items = $data['cart'] ?? [];

if ($endereco_id <= 0 || empty($cart_items)) {
    echo json_encode(['success' => false, 'message' => 'Endereço ou carrinho inválido.']);
    exit;
}

// Inicia uma transação para garantir a integridade dos dados
$conn->begin_transaction();

try {
    $total_value = 0;
    $product_ids = array_map(function($item) { return $item['productId']; }, $cart_items);
    
    // Busca os preços atuais dos produtos no banco de dados (mais seguro)
    $sql_prices = "SELECT id, preco FROM produtos WHERE id IN (" . implode(',', array_fill(0, count($product_ids), '?')) . ")";
    $stmt_prices = $conn->prepare($sql_prices);
    $stmt_prices->bind_param(str_repeat('i', count($product_ids)), ...$product_ids);
    $stmt_prices->execute();
    $result_prices = $stmt_prices->get_result();
    $db_prices = [];
    while ($row = $result_prices->fetch_assoc()) {
        $db_prices[$row['id']] = $row['preco'];
    }
    $stmt_prices->close();

    // Calcula o valor total e cria um array de itens de pedido
    $order_items_to_insert = [];
    foreach ($cart_items as $item) {
        $price = $db_prices[$item['productId']];
        $total_value += $price * $item['quantity'];
        $order_items_to_insert[] = [
            'id' => $item['productId'],
            'quantity' => $item['quantity'],
            'price' => $price
        ];
    }
    
    // 1. Insere o pedido na tabela `pedidos`
    $stmt_order = $conn->prepare("INSERT INTO pedidos (cliente_id, endereco_entrega_id, valor_total, status_pedido) VALUES (?, ?, ?, 'Processando')");
    $stmt_order->bind_param("iid", $cliente_id, $endereco_id, $total_value);
    $stmt_order->execute();
    $pedido_id = $stmt_order->insert_id;
    $stmt_order->close();

    // 2. Insere cada item na tabela `itens_pedido`
    $stmt_items = $conn->prepare("INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)");
    foreach ($order_items_to_insert as $item) {
        $stmt_items->bind_param("iiid", $pedido_id, $item['id'], $item['quantity'], $item['price']);
        $stmt_items->execute();
    }
    $stmt_items->close();

    // 3. (Opcional, mas recomendado) Atualiza o estoque
    $stmt_stock = $conn->prepare("UPDATE produtos SET estoque = estoque - ? WHERE id = ?");
    foreach ($order_items_to_insert as $item) {
        $stmt_stock->bind_param("ii", $item['quantity'], $item['id']);
        $stmt_stock->execute();
    }
    $stmt_stock->close();

    // Se tudo deu certo, confirma a transação
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Pedido criado com sucesso!', 'order_id' => $pedido_id]);

} catch (Exception $e) {
    // Se algo deu errado, desfaz a transação
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Erro ao processar o pedido.', 'error' => $e->getMessage()]);
}

$conn->close();
?>