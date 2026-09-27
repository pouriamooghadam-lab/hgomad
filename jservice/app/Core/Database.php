<?php
declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $pdo = null;

    public static function connect(): PDO
    {
        if (self::$pdo === null) {
            $host = env('DB_HOST', 'localhost');
            $port = env('DB_PORT', '3306');
            $dbname = env('DB_DATABASE', 'jservice');
            $user = env('DB_USERNAME', 'root');
            $pass = env('DB_PASSWORD', '');
            $charset = env('DB_CHARSET', 'utf8mb4');

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE " . env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            ];

            try {
                self::$pdo = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                Logger::error('Database connection failed: ' . $e->getMessage());
                throw new \RuntimeException('اتصال به پایگاه داده با خطا مواجه شد. لطفاً فایل تنظیمات .env را بررسی کنید.');
            }
        }

        return self::$pdo;
    }

    public static function select(string $query, array $params = []): array
    {
        $stmt = self::connect()->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function selectOne(string $query, array $params = []): ?array
    {
        $stmt = self::connect()->prepare($query);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function insert(string $query, array $params = []): int
    {
        $stmt = self::connect()->prepare($query);
        $stmt->execute($params);
        return (int) self::connect()->lastInsertId();
    }

    public static function execute(string $query, array $params = []): int
    {
        $stmt = self::connect()->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public static function beginTransaction(): bool
    {
        return self::connect()->beginTransaction();
    }

    public static function commit(): bool
    {
        return self::connect()->commit();
    }

    public static function rollBack(): bool
    {
        return self::connect()->rollBack();
    }
}
