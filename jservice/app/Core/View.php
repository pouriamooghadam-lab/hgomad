<?php
declare(strict_types=1);

namespace App\Core;

class View
{
    public static function render(string $template, array $data = []): Response
    {
        $path = APP_PATH . '/Views/' . str_replace('.', '/', $template) . '.php';

        if (!file_exists($path)) {
            throw new \RuntimeException("قالب ویو یافت نشد: {$template} در مسیر {$path}");
        }

        extract($data);

        ob_start();
        require $path;
        $content = ob_get_clean();

        return new Response($content, 200, ['Content-Type' => 'text/html; charset=utf-8']);
    }
}
