<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\License;
use App\Core\Request;
use App\Core\Response;

class LicenseMiddleware
{
    public function handle(Request $request): ?Response
    {
        $status = License::check();
        if (($status['status'] ?? '') !== 'active') {
            if (str_starts_with($request->getUri(), '/api/')) {
                return Response::json([
                    'success' => false,
                    'error'   => 'لایسنس نرم‌افزار منقضی یا غیرفعال است.'
                ], 403);
            }
            return Response::redirect('/license/expired');
        }
        return null;
    }
}
