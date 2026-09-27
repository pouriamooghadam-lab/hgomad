<?php
declare(strict_types=1);

namespace App\Core;

class CSRF
{
    public static function token(): string
    {
        $token = Session::get('_csrf_token');
        if (!$token) {
            $token = bin2hex(random_bytes(32));
            Session::set('_csrf_token', $token);
        }
        return $token;
    }

    public static function validate(?string $submittedToken): bool
    {
        $token = Session::get('_csrf_token');
        if (!$token || !$submittedToken) {
            return false;
        }
        return hash_equals($token, $submittedToken);
    }
}
