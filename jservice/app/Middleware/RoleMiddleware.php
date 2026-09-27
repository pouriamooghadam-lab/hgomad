<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Response;

class RoleMiddleware
{
    /**
     * Check if authenticated user has one of allowed roles
     *
     * @param Request $request
     * @param array $allowedRoles
     * @return Response|null
     */
    public function handle(Request $request, array $allowedRoles = []): ?Response
    {
        if (!Auth::check()) {
            if (str_starts_with($request->getUri(), '/api/')) {
                return Response::json(['success' => false, 'error' => 'عدم دسترسی. ابتدا وارد شوید.'], 401);
            }
            return Response::redirect('/login');
        }

        $user = Auth::user();
        $userRole = $user['role'] ?? 'guest';

        // Super-admin always has access
        if ($userRole === 'admin' || $userRole === 'superadmin') {
            return null;
        }

        if (!empty($allowedRoles) && !in_array($userRole, $allowedRoles, true)) {
            if (str_starts_with($request->getUri(), '/api/')) {
                return Response::json(['success' => false, 'error' => 'شما مجوز دسترسی به این بخش را ندارید.'], 403);
            }
            return Response::view('errors/403', ['message' => 'سطح دسترسی شما برای این عملیات مجاز نیست.']);
        }

        return null;
    }
}
