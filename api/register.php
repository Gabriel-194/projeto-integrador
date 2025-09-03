<?php
require_once('../connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Dados do Cliente
$nome = $data['name'] ?? '';
$email = $data['email'] ?? '';
$senha = $data['password'] ?? '';
$cpf = $data['cpf'] ?? '';
$telefone = $data['telefone'] ?? '';

// Dados do Endereço
$cep = $data['cep'] ?? '';
$logradouro = $data['logradouro'] ?? '';
$numero_end = $data['numero'] ?? '';
$bairro = $data['bairro'] ?? '';
$cidade = $data['cidade'] ?? '';
$estado = $data['estado'] ?? '';

// Validação simples
if (empty($nome) || empty($email) || empty($senha) || empty($cpf) || empty($telefone) || empty($cep) || empty($logradouro) || empty($numero_end) || empty($bairro) || empty($cidade) || empty($estado)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios.']);
    exit;
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Inicia uma transação
$conn->begin_transaction();

try {
    // 1. Insere o cliente na tabela `clientes`
    $stmt_cliente = $conn->prepare("INSERT INTO clientes (nome_completo, email, senha_hash, cpf) VALUES (?, ?, ?, ?)");
    $stmt_cliente->bind_param("ssss", $nome, $email, $senha_hash, $cpf);
    $stmt_cliente->execute();
    
    // Pega o ID do cliente que acabou de ser inserido
    $cliente_id = $conn->insert_id;
    $stmt_cliente->close();

    // 2. Insere o endereço na tabela `enderecos`
    $stmt_endereco = $conn->prepare("INSERT INTO enderecos (cliente_id, logradouro, numero, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt_endereco->bind_param("issssss", $cliente_id, $logradouro, $numero_end, $bairro, $cidade, $estado, $cep);
    $stmt_endereco->execute();
    $stmt_endereco->close();

    // 3. Insere o telefone na tabela `telefones`
    $stmt_telefone = $conn->prepare("INSERT INTO telefones (cliente_id, numero) VALUES (?, ?)");
    $stmt_telefone->bind_param("is", $cliente_id, $telefone);
    $stmt_telefone->execute();
    $stmt_telefone->close();

    // Se tudo deu certo, confirma as operações
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso!']);

} catch (mysqli_sql_exception $exception) {
    // Se algo deu errado, desfaz todas as operações
    $conn->rollback();
    
    // Verifica se o erro é de chave duplicada (email ou cpf)
    if ($conn->errno == 1062) {
        echo json_encode(['success' => false, 'message' => 'Este e-mail ou CPF já está cadastrado.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao realizar o cadastro: ' . $exception->getMessage()]);
    }
}

$conn->close();
?>