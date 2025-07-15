<?php
require_once '../database.php';

setJsonHeader();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Test database connection
        $stmt = $pdo->query("SELECT 1");
        echo json_encode(['status' => 'ok', 'message' => 'Valomate API is running']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    }
}
?>