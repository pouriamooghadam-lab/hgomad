<?php
declare(strict_types=1);

namespace App\Core;

class Router
{
    private static array $routes = [];
    private static string $groupPrefix = '';
    private static array $groupMiddlewares = [];

    public static function get(string $path, array|callable $handler, array $middlewares = []): void
    {
        self::addRoute('GET', $path, $handler, $middlewares);
    }

    public static function post(string $path, array|callable $handler, array $middlewares = []): void
    {
        self::addRoute('POST', $path, $handler, $middlewares);
    }

    public static function group(array $attributes, callable $callback): void
    {
        $prevPrefix = self::$groupPrefix;
        $prevMiddlewares = self::$groupMiddlewares;

        if (isset($attributes['prefix'])) {
            self::$groupPrefix = $prevPrefix . '/' . trim($attributes['prefix'], '/');
        }
        if (isset($attributes['middleware'])) {
            $m = is_array($attributes['middleware']) ? $attributes['middleware'] : [$attributes['middleware']];
            self::$groupMiddlewares = array_merge($prevMiddlewares, $m);
        }

        call_user_func($callback);

        self::$groupPrefix = $prevPrefix;
        self::$groupMiddlewares = $prevMiddlewares;
    }

    private static function addRoute(string $method, string $path, array|callable $handler, array $middlewares): void
    {
        $fullPath = self::$groupPrefix . '/' . trim($path, '/');
        $fullPath = '/' . trim($fullPath, '/');
        if ($fullPath !== '/') {
            $fullPath = rtrim($fullPath, '/');
        }

        $allMiddlewares = array_merge(self::$groupMiddlewares, $middlewares);

        self::$routes[] = [
            'method'      => $method,
            'path'        => $fullPath,
            'handler'     => $handler,
            'middlewares' => $allMiddlewares,
        ];
    }

    public function dispatch(Request $request): Response
    {
        $uri = $request->getUri();
        if ($uri !== '/' && str_ends_with($uri, '/')) {
            $uri = rtrim($uri, '/');
        }
        $method = $request->getMethod();

        foreach (self::$routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            // Convert pattern to regex
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $params = [];
                foreach ($matches as $k => $v) {
                    if (is_string($k)) {
                        $params[$k] = $v;
                    }
                }

                // Execute Middlewares
                foreach ($route['middlewares'] as $middleware) {
                    $middlewareClass = is_string($middleware) && !str_contains($middleware, '\\')
                        ? "App\\Middleware\\{$middleware}"
                        : $middleware;

                    if (class_exists($middlewareClass)) {
                        $instance = new $middlewareClass();
                        $res = $instance->handle($request);
                        if ($res instanceof Response) {
                            return $res;
                        }
                    }
                }

                // Call Handler
                $handler = $route['handler'];
                if (is_callable($handler)) {
                    $result = call_user_func($handler, $request, $params);
                } elseif (is_array($handler) && count($handler) === 2) {
                    [$controllerClass, $action] = $handler;
                    $controller = new $controllerClass();
                    $result = $controller->$action($request, $params);
                } else {
                    throw new \RuntimeException('Invalid route handler.');
                }

                if ($result instanceof Response) {
                    return $result;
                }
                return new Response((string)$result);
            }
        }

        // Route not found 404
        if (str_starts_with($uri, '/api/')) {
            return Response::json(['success' => false, 'error' => 'API endpoint not found'], 404);
        }

        http_response_code(404);
        if (file_exists(APP_PATH . '/Views/errors/404.php')) {
            ob_start();
            require_once APP_PATH . '/Views/errors/404.php';
            return new Response(ob_get_clean(), 404);
        }
        return new Response('<h1 align="center" dir="rtl">صفحه مورد نظر یافت نشد (خطای ۴۰۴)</h1>', 404);
    }
}
