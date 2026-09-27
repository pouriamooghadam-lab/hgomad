<?php
/**
 * JSERVICE ERP - Front Controller (Public Entry Point)
 * Production Ready for Shared Hosting (cPanel / DirectAdmin / PHP 8.1+)
 */

declare(strict_types=1);

define('JSERVICE_START', microtime(true));
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('CONFIG_PATH', ROOT_PATH . '/config');
define('STORAGE_PATH', ROOT_PATH . '/storage');
define('PUBLIC_PATH', __DIR__);

// Check if installation is needed
if (!file_exists(STORAGE_PATH . '/installed.lock') && file_exists(ROOT_PATH . '/install.php')) {
    header('Location: /install.php');
    exit;
}

// 1. Autoloader (Composer or Native PSR-4 Fallback)
if (file_exists(ROOT_PATH . '/vendor/autoload.php')) {
    require_once ROOT_PATH . '/vendor/autoload.php';
} else {
    // Zero-dependency native PSR-4 autoloader for shared hosts without Composer
    spl_autoload_register(function (string $class) {
        $prefix = 'App\\';
        $baseDir = APP_PATH . '/';

        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    });

    if (file_exists(APP_PATH . '/Core/Helper.php')) {
        require_once APP_PATH . '/Core/Helper.php';
    }
}

// 2. Load Environment Variables (.env)
\App\Core\Env::load(ROOT_PATH . '/.env');

// 3. Security Settings & Error Handling
date_default_timezone_set(env('APP_TIMEZONE', 'Asia/Tehran'));
$debug = filter_var(env('APP_DEBUG', false), FILTER_VALIDATE_BOOLEAN);

if ($debug) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// 4. Secure Session Management
\App\Core\Session::start();

// 5. Initialize Application Router & Dispatch Request
try {
    $router = new \App\Core\Router();
    require_once ROOT_PATH . '/routes/web.php';
    require_once ROOT_PATH . '/routes/api.php';

    $request = \App\Core\Request::capture();
    $response = $router->dispatch($request);
    $response->send();
} catch (\Throwable $e) {
    \App\Core\Logger::error($e->getMessage(), [
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);

    if ($debug) {
        echo "<div dir='ltr' style='background:#1e293b;color:#f87171;padding:25px;font-family:monospace;border-radius:12px;margin:20px;'>";
        echo "<h2 style='color:#ef4444;'>JSERVICE Application Error: " . htmlspecialchars($e->getMessage()) . "</h2>";
        echo "<p><strong>File:</strong> " . htmlspecialchars($e->getFile()) . " on line " . $e->getLine() . "</p>";
        echo "<pre style='background:#0f172a;padding:15px;border-radius:8px;color:#cbd5e1;overflow-x:auto;'>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
        echo "</div>";
    } else {
        http_response_code(500);
        require_once APP_PATH . '/Views/errors/500.php';
    }
}
