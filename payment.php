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
    <title>Pagamento PIX | Essence Wear</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <header id="header" class="header">
        <div class="container">
            <div class="header-container">
                 <a href="index.php" class="mobile-menu-logo header-element">ESSENCE</a>
            </div>
        </div>
    </header>

    <main>
        <div id="payment-page-container" class="payment-page container">
            <div class="payment-box">
                <h2>Finalize com PIX</h2>
                <p>Escaneie o QR Code abaixo com o aplicativo do seu banco.</p>
                <img id="qr-code-img" src="" alt="QR Code PIX">
                <p>Ou utilize o código "copia e cola":</p>
                <div class="pix-code-box">
                    <span id="pix-code"></span>
                    <button id="copy-pix-code-btn" title="Copiar código"><i data-lucide="copy"></i></button>
                </div>
                <h4>Total: <span id="total-amount"></span></h4>
                <p class="text-secondary">
                    Você será redirecionado para a confirmação em <strong id="countdown-timer">30</strong> segundos...
                </p>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ESSENCE WEAR. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>