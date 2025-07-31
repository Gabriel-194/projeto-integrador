<?php
$host = 'localhost'; // Removida a porta :3306
$user = 'root';
$password = '';
$database = 'essence_wear_db';

// Define o report de erros para exceções, mais fácil de depurar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $user, $password, $database);
    // Garante que a comunicação use o charset correto
    $conn->set_charset("utf8mb4");
} catch(Exception $e) {
    // Se a conexão falhar, o script para e exibe um erro claro
    error_log($e->getMessage());
    die("Falha na conexão com o banco de dados.");
}
?>