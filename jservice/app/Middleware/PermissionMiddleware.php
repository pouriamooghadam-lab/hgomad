<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Response;

class PermissionMiddleware
{
    /**
     * Check if authenticated user has permission
     */
    public function handle(Request $request, string $permission = ''): ?Response
    {
        if (!Auth::check()) {
            return str_starts_with($request->getUri(), '/api/')
                ? Response::json(['success' => false, 'error' => 'عدم دسترسی.'], 401)
                : Response::redirect('/login');
        }

        $user = Auth::user();
        if ($user['role'] === 'admin' || $user['role'] === 'superadmin') {
            return null;
        }

        $userPermissions = $user['permissions'] ?? [];
        if (is_string($userPermissions)) {
            $userPermissions = json_decode($userPermissions, true) ?? [];
        }

        if (!empty($permission) && !in_array($permission, $userPermissions, true)) {
            return str_starts_with($request->getUri(), '/api/')
                ? Response::json(['success' => false, 'error' => 'دسترسی عملیاتی لازم یافت نشد.'], 403)
                : Response::view('errors/403', ['message' => 'دسترسی لازم برای این عملیات را ندارید.']);
        }

        return null;
    }
}
