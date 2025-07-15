<?php
// Bu dosya cron job için kullanılacak
// cPanel'de cron job oluşturun: */5 * * * * /usr/bin/php /home/username/public_html/cleanup_cron.php

require_once 'database.php';

try {
    $deleted_count = cleanupOldPlayers();
    echo date('Y-m-d H:i:s') . " - Cleanup completed. Deleted $deleted_count old players.\n";
} catch(Exception $e) {
    echo date('Y-m-d H:i:s') . " - Cleanup error: " . $e->getMessage() . "\n";
}
?>