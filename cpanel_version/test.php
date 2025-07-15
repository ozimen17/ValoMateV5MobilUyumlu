<?php
// VALOMATE - Test Script
// Bu dosyayı kurulum sonrası test için kullanın
// Kurulum tamamlandıktan sonra güvenlik için silin

echo "<h1>VALOMATE - Test Script</h1>";

// PHP Version Check
echo "<h2>PHP Version</h2>";
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "PHP Version OK: " . (version_compare(PHP_VERSION, '7.4.0', '>=') ? '✅ Yes' : '❌ No') . "<br><br>";

// Database Connection Test
echo "<h2>Database Connection</h2>";
try {
    require_once 'database.php';
    echo "Database Connection: ✅ Success<br>";
    
    // Test tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables Found: " . count($tables) . "<br>";
    foreach ($tables as $table) {
        echo "- " . $table . "<br>";
    }
    
    // Test sample data
    $stmt = $pdo->query("SELECT COUNT(*) FROM games");
    $gameCount = $stmt->fetchColumn();
    echo "Games in database: " . $gameCount . "<br>";
    
    $stmt = $pdo->query("SELECT COUNT(*) FROM players");
    $playerCount = $stmt->fetchColumn();
    echo "Players in database: " . $playerCount . "<br>";
    
} catch (Exception $e) {
    echo "Database Connection: ❌ Failed<br>";
    echo "Error: " . $e->getMessage() . "<br>";
}

echo "<br>";

// API Endpoints Test
echo "<h2>API Endpoints</h2>";
$apiEndpoints = [
    'health.php' => 'Health Check',
    'games.php' => 'Games',
    'players.php' => 'Players',
    'cleanup.php' => 'Cleanup'
];

foreach ($apiEndpoints as $endpoint => $name) {
    $url = "api/" . $endpoint;
    echo "Testing $name ($url): ";
    
    if (file_exists($url)) {
        echo "✅ File exists<br>";
    } else {
        echo "❌ File not found<br>";
    }
}

echo "<br>";

// File Permissions Test
echo "<h2>File Permissions</h2>";
$files = [
    'database.php' => 644,
    'index.html' => 644,
    'api/players.php' => 644,
    'js/app.js' => 644
];

foreach ($files as $file => $expectedPerm) {
    $actualPerm = substr(sprintf('%o', fileperms($file)), -3);
    echo "$file: ";
    echo ($actualPerm == $expectedPerm) ? "✅ $actualPerm" : "⚠️ $actualPerm (expected $expectedPerm)";
    echo "<br>";
}

echo "<br>";

// Extensions Check
echo "<h2>PHP Extensions</h2>";
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
foreach ($requiredExtensions as $ext) {
    echo "$ext: " . (extension_loaded($ext) ? '✅ Loaded' : '❌ Not loaded') . "<br>";
}

echo "<br>";

// Environment Info
echo "<h2>Environment Info</h2>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
echo "Current Directory: " . __DIR__ . "<br>";
echo "Script Name: " . $_SERVER['SCRIPT_NAME'] . "<br>";

echo "<br>";
echo "<hr>";
echo "<p><strong>Test completed!</strong></p>";
echo "<p>If all tests pass, your VALOMATE installation is ready.</p>";
echo "<p style='color: red;'><strong>IMPORTANT: Delete this test.php file after testing for security.</strong></p>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h1 { color: #333; }
h2 { color: #666; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
</style>