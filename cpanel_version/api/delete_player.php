<?php
require_once '../database.php';

setJsonHeader();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Player ID is required']);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM players WHERE id = ?");
        $stmt->execute([$input['id']]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Oyuncu bulunamadı']);
            exit;
        }
        
        echo json_encode(['message' => 'Oyuncu silindi']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>