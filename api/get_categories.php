<?php
require_once('../connection.php');
header('Content-Type: application/json');

$sql = "SELECT id, nome FROM categorias ORDER BY nome ASC";
$result = $conn->query($sql);

$categories = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
}

echo json_encode($categories);

$conn->close();
?>