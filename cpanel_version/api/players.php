<?php
require_once '../database.php';

setJsonHeader();

// Cleanup old players first
cleanupOldPlayers();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT id, username, tag, lobby_code, game, min_rank, max_rank, looking_for, game_mode, mic_enabled, created_at FROM players WHERE 1=1";
        $params = [];
        
        // Apply filters
        if (!empty($_GET['game'])) {
            $query .= " AND game = ?";
            $params[] = $_GET['game'];
        }
        
        if (!empty($_GET['game_mode']) && $_GET['game_mode'] !== 'Tümü') {
            $query .= " AND game_mode = ?";
            $params[] = $_GET['game_mode'];
        }
        
        if (!empty($_GET['looking_for']) && $_GET['looking_for'] !== 'Tümü') {
            $query .= " AND looking_for = ?";
            $params[] = $_GET['looking_for'];
        }
        
        if (!empty($_GET['mic_only']) && $_GET['mic_only'] === 'true') {
            $query .= " AND mic_enabled = 1";
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $players = $stmt->fetchAll();
        
        // Convert created_at to ISO format for frontend compatibility
        foreach ($players as &$player) {
            $player['created_at'] = date('c', strtotime($player['created_at']));
            $player['mic_enabled'] = (bool)$player['mic_enabled'];
        }
        
        echo json_encode($players);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            exit;
        }
        
        // Required fields validation
        if (empty($input['username']) || empty($input['tag']) || empty($input['lobby_code'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username, tag, and lobby_code are required']);
            exit;
        }
        
        // Generate ID if not provided
        $id = !empty($input['id']) ? $input['id'] : generateUuid();
        
        // Generate lobby code if not provided
        $lobby_code = !empty($input['lobby_code']) ? $input['lobby_code'] : generateLobbyCode();
        
        $stmt = $pdo->prepare("
            INSERT INTO players (id, username, tag, lobby_code, game, min_rank, max_rank, looking_for, game_mode, mic_enabled, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $id,
            $input['username'],
            $input['tag'],
            $lobby_code,
            $input['game'] ?? 'valorant',
            $input['min_rank'] ?? 'Demir',
            $input['max_rank'] ?? 'Radyant',
            $input['looking_for'] ?? '1 Kişi',
            $input['game_mode'] ?? 'Dereceli',
            isset($input['mic_enabled']) ? (int)$input['mic_enabled'] : 1
        ]);
        
        echo json_encode(['id' => $id, 'message' => 'Oyuncu başarıyla eklendi']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>