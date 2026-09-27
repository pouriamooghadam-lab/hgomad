<?php
declare(strict_types=1);

if (!function_exists('env')) {
    function env(string $key, mixed $default = null): mixed {
        return \App\Core\Env::get($key, $default);
    }
}

if (!function_exists('config')) {
    function config(string $key, mixed $default = null): mixed {
        return \App\Core\Config::get($key, $default);
    }
}

if (!function_exists('view')) {
    function view(string $template, array $data = []): \App\Core\Response {
        return \App\Core\View::render($template, $data);
    }
}

if (!function_exists('redirect')) {
    function redirect(string $url, int $statusCode = 302): \App\Core\Response {
        return \App\Core\Response::redirect($url, $statusCode);
    }
}

if (!function_exists('json')) {
    function json(mixed $data, int $status = 200): \App\Core\Response {
        return \App\Core\Response::json($data, $status);
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string {
        return \App\Core\CSRF::token();
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string {
        return '<input type="hidden" name="_token" value="' . csrf_token() . '">';
    }
}

if (!function_exists('auth')) {
    function auth(): ?\App\Models\User {
        return \App\Core\Auth::user();
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string {
        $baseUrl = rtrim(env('APP_URL', ''), '/');
        return $baseUrl . '/assets/' . ltrim($path, '/');
    }
}

if (!function_exists('format_currency')) {
    function format_currency(float|int $amount, string $currency = 'تومان'): string {
        return number_format((float)$amount, 0, '.', ',') . ' ' . $currency;
    }
}

if (!function_exists('to_persian_num')) {
    function to_persian_num(string|int|float $str): string {
        $en = ['0','1','2','3','4','5','6','7','8','9'];
        $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return str_replace($en, $fa, (string)$str);
    }
}
