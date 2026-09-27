<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Response;

class AuthMiddleware
{
    public function handle(Request $request): ?Response
    {
        if (!Auth::check()) {
            if (str_starts_with($request->getUri(), '/api/')) {
                return Response::json(['success' => false, 'error' => 'عدم احراز هویت. لطفاً وارد شوید.'], 401);
            }
            return Response::redirect('/login');
        }
        return null;
    }
}
