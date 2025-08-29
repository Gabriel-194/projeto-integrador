<?php
include('connection.php');
session_start();

// Proteção: se o usuário não estiver logado, redireciona para o login
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finalizar Compra | Essence Wear</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <?php include('header.php'); // Reutilizaremos o header ?>

    <main>
        <div class="checkout-page container">
            <h1>Finalizar Compra</h1>
            <div id="checkout-container" class="checkout-container">
                <p>Carregando informações...</p>
            </div>
        </div>
    </main>

    <?php include('footer.php'); // Reutilizaremos o footer ?>
    <script src="script.js"></script>
</body>
</html>