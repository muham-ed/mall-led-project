<?php
require_once __DIR__ . '/config.php';

function db() {
    static $pdo = null;
    if ($pdo === null) {
        $hostsToTry = [];

        if (strpos(DB_HOST, ':') !== false) {
            list($h, $p) = explode(':', DB_HOST, 2);
            $hostsToTry[] = "mysql:host=$h;port=$p;dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        }
        $hostsToTry[] = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $hostsToTry[] = "mysql:host=127.0.0.1;port=3306;dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $hostsToTry[] = "mysql:host=127.0.0.1;port=3307;dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $hostsToTry[] = "mysql:host=localhost;dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

        $lastErr = null;
        foreach ($hostsToTry as $dsn) {
            try {
                $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
                return $pdo;
            } catch (PDOException $e) {
                $lastErr = $e;
            }
        }
        throw $lastErr;
    }
    return $pdo;
}