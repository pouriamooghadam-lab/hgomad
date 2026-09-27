<?php
/**
 * JSERVICE ERP - نمونه فایل تنظیمات اتصال هاست
 * نام این فایل را به config.php تغییر داده یا از نصاب install.php استفاده کنید.
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');

define('APP_NAME', 'سامانه خدمات پس از فروش جی سرویس');
define('LICENSE_KEY', 'JS-ENT-2024-9981-FA-PRO');
define('APP_DEBUG', false);

// تابع اتصال امن PDO با پشتیبانی از حروف فارسی و کاراکترهای خاص
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_persian_ci"
        ]);
    }
    return $pdo;
}
