<?php
require_once '../database.php';

setJsonHeader();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $deleted_count = cleanupOldPlayers();
        echo json_encode(['message' => 'Cleanup completed', 'deleted_count' => $deleted_count]);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Cleanup error: ' . $e->getMessage()]);
    }
}
?>