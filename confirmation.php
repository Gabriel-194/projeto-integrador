<?php
include('connection.php');
session_start();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Confirmado | Essence Wear</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <?php include('header.php'); ?>

    <main>
        <div class="confirmation-page container">
            <div class="confirmation-box">
                <i data-lucide="check-circle" class="confirmation-icon"></i>
                <h2>Pedido Realizado com Sucesso!</h2>
                <p>Obrigado pela sua compra. Você pode acompanhar o status do seu pedido no seu perfil.</p>
                <div class="confirmation-actions">
                    <a href="perfil.php" class="btn-primary">Ver Meus Pedidos</a>
                    <a href="loja.php" class="btn-secondary">Continuar Comprando</a>
                </div>
            </div>
        </div>
    </main>
    
    <?php include('footer.php'); ?>
    <script src="script.js"></script>
</body>
</html>