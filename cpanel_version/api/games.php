<?php
require_once '../database.php';

setJsonHeader();

// Cleanup old players first
cleanupOldPlayers();

try {
    $stmt = $pdo->prepare("SELECT id, name, slug, icon, description FROM games");
    $stmt->execute();
    $games = $stmt->fetchAll();
    
    echo json_encode($games);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>