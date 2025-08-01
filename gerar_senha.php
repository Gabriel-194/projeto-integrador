<?php
// A senha que queremos criptografar
$senha_em_texto = 'admin123';

// Usa a função padrão e segura do PHP para criar o hash
$hash_gerado = password_hash($senha_em_texto, PASSWORD_DEFAULT);

// Exibe o hash gerado de forma clara
echo "<h1>Hash Gerado para a Senha 'admin123'</h1>";
echo "<p>Por favor, copie a linha de texto abaixo e use-a para atualizar o campo 'senha_hash' do seu utilizador 'admin' no phpMyAdmin.</p>";
echo "<hr>";
echo "<h3>Hash a Copiar:</h3>";
echo "<p style='font-family: monospace; font-size: 1.2rem; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;'>" . htmlspecialchars($hash_gerado) . "</p>";
?>