<?php
// Database configuration
// Bu bilgileri kendi hosting bilgilerinizle güncelleyin
$db_host = 'localhost';        // Genellikle localhost
$db_username = 'your_username'; // cPanel MySQL kullanıcı adı
$db_password = 'your_password'; // cPanel MySQL şifresi
$db_name = 'your_database';     // Oluşturacağınız veritabanı adı

// Database connection
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Helper functions
function generateLobbyCode() {
    $letters = '';
    for ($i = 0; $i < 3; $i++) {
        $letters .= chr(rand(65, 90)); // A-Z
    }
    $numbers = str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);
    return $letters . $numbers;
}

function generateUuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function cleanupOldPlayers() {
    global $pdo;
    try {
        $cutoff_time = date('Y-m-d H:i:s', strtotime('-30 minutes'));
        $stmt = $pdo->prepare("DELETE FROM players WHERE created_at < ?");
        $stmt->execute([$cutoff_time]);
        return $stmt->rowCount();
    } catch(PDOException $e) {
        error_log("Cleanup error: " . $e->getMessage());
        return 0;
    }
}

// Set JSON header
function setJsonHeader() {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
}
?>