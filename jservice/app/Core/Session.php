<?php
declare(strict_types=1);

namespace App\Core;

class Session
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $lifetime = (int) env('SESSION_LIFETIME', 1800);
            $secure = filter_var(env('SESSION_SECURE_COOKIE', false), FILTER_VALIDATE_BOOLEAN) && (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
            $httponly = filter_var(env('SESSION_HTTP_ONLY', true), FILTER_VALIDATE_BOOLEAN);
            $samesite = env('SESSION_SAME_SITE', 'Strict');

            session_set_cookie_params([
                'lifetime' => $lifetime,
                'path'     => '/',
                'domain'   => $_SERVER['HTTP_HOST'] ?? '',
                'secure'   => $secure,
                'httponly' => $httponly,
                'samesite' => $samesite,
            ]);

            session_start();

            // Auto-check timeout
            if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $lifetime)) {
                self::destroy();
                return;
            }
            $_SESSION['LAST_ACTIVITY'] = time();
        }
    }

    public static function set(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return $_SESSION[$key] ?? $default;
    }

    public static function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    public static function remove(string $key): void
    {
        unset($_SESSION[$key]);
    }

    public static function regenerate(): void
    {
        session_regenerate_id(true);
    }

    public static function flash(string $key, mixed $value): void
    {
        $_SESSION['_flash'][$key] = $value;
    }

    public static function getFlash(string $key, mixed $default = null): mixed
    {
        $val = $_SESSION['_flash'][$key] ?? $default;
        unset($_SESSION['_flash'][$key]);
        return $val;
    }

    public static function destroy(): void
    {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }
}
