<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\View;
use App\Core\CSRF;

abstract class BaseController
{
    protected function view(string $template, array $data = []): Response
    {
        return View::render($template, $data);
    }

    protected function json(mixed $data, int $statusCode = 200): Response
    {
        return Response::json($data, $statusCode);
    }

    protected function redirect(string $url, int $statusCode = 302): Response
    {
        return Response::redirect($url, $statusCode);
    }

    protected function validateCSRF(Request $request): bool
    {
        $token = $request->input('_token');
        return CSRF::validate($token);
    }
}
