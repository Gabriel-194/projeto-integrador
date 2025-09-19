<?php
require_once('../../connection.php');
header('Content-Type: application/json');

// Dados do formulário
$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? 0;
$categoria_id = $_POST['categoria_id'] ?? 0;
$tipo_produto = $_POST['tipo_produto'] ?? 'Roupa'; // Novo
$tamanhos = $_POST['tamanhos'] ?? []; // Novo - será um array de IDs

// Validações básicas
if (empty($nome) || $preco <= 0 || $categoria_id <= 0 || !isset($_FILES['imagem_principal'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos ou imagem faltando.']);
    exit;
}

// Lógica de upload de imagem (coloque seu código de upload aqui)
$baseDir = dirname(__DIR__, 2);
$uploadDir = $baseDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'produtos' . DIRECTORY_SEPARATOR;
$dbPath = 'assets/produtos/';
$fileName = uniqid() . '-' . basename($_FILES['imagem_principal']['name']);
$targetPath = $uploadDir . $fileName;
$finalDbPath = $dbPath . $fileName;

// Inicia a transação
$conn->begin_transaction();

try {
    // 1. Move o arquivo
    if (!move_uploaded_file($_FILES['imagem_principal']['tmp_name'], $targetPath)) {
        throw new Exception('Erro ao mover o arquivo de imagem.');
    }

    // 2. Insere o produto na tabela `produtos`
    $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, categoria_id, tipo_produto, imagem_principal) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdiss", $nome, $descricao, $preco, $categoria_id, $tipo_produto, $finalDbPath);
    $stmt->execute();
    
    // Pega o ID do produto que acabou de ser inserido
    $newProductId = $conn->insert_id;
    $stmt->close();
    
    if ($newProductId <= 0) {
        throw new Exception('Falha ao obter o ID do novo produto.');
    }

    // 3. Insere os tamanhos na tabela `produto_tamanhos` se houver algum
    if (!empty($tamanhos)) {
        $stmt_tamanhos = $conn->prepare("INSERT INTO produto_tamanhos (produto_id, tamanho_id) VALUES (?, ?)");
        foreach ($tamanhos as $tamanho_id) {
            // Validação para garantir que o ID é um número
            if (is_numeric($tamanho_id)) {
                $stmt_tamanhos->bind_param("ii", $newProductId, $tamanho_id);
                $stmt_tamanhos->execute();
            }
        }
        $stmt_tamanhos->close();
    }

    // Se tudo deu certo, confirma as operações
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Produto e seus tamanhos foram adicionados com sucesso!']);

} catch (Exception $e) {
    // Se algo deu errado, desfaz todas as operações
    $conn->rollback();
    // Opcional: deleta o arquivo que foi upado se a transação falhar
    if (file_exists($targetPath)) {
        unlink($targetPath);
    }
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar o produto: ' . $e->getMessage()]);
}

$conn->close();
?>