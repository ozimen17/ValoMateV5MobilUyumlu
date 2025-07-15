-- VALOMATE Database Schema
-- Bu SQL dosyasını phpMyAdmin'de çalıştırın

-- Veritabanı oluşturma (isteğe bağlı - cPanel'de manuel oluşturabilirsiniz)
-- CREATE DATABASE IF NOT EXISTS valomate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE valomate_db;

-- Players tablosu
CREATE TABLE IF NOT EXISTS `players` (
    `id` varchar(36) NOT NULL,
    `username` varchar(100) NOT NULL,
    `tag` varchar(20) NOT NULL,
    `lobby_code` varchar(10) NOT NULL,
    `game` varchar(50) DEFAULT 'valorant',
    `min_rank` varchar(20) DEFAULT 'Demir',
    `max_rank` varchar(20) DEFAULT 'Radyant',
    `looking_for` varchar(20) DEFAULT '1 Kişi',
    `game_mode` varchar(20) DEFAULT 'Dereceli',
    `mic_enabled` tinyint(1) DEFAULT 1,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_game` (`game`),
    KEY `idx_game_mode` (`game_mode`),
    KEY `idx_looking_for` (`looking_for`),
    KEY `idx_mic_enabled` (`mic_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Games tablosu
CREATE TABLE IF NOT EXISTS `games` (
    `id` varchar(36) NOT NULL,
    `name` varchar(100) NOT NULL,
    `slug` varchar(50) NOT NULL,
    `icon` varchar(10) DEFAULT '👥',
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan oyun verisi
INSERT INTO `games` (`id`, `name`, `slug`, `icon`, `description`) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Takım arkadaşı bul', 'find-team', '👥', 'Oyun arkadaşları bul')
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `icon` = VALUES(`icon`),
    `description` = VALUES(`description`);

-- Otomatik temizleme için event scheduler (isteğe bağlı)
-- Bu hosting sağlayıcınız event scheduler'ı destekliyorsa kullanabilirsiniz
-- Alternatif olarak cron job kullanabilirsiniz

-- SET GLOBAL event_scheduler = ON;

-- CREATE EVENT IF NOT EXISTS cleanup_old_players
-- ON SCHEDULE EVERY 5 MINUTE
-- DO
--   DELETE FROM players WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE);