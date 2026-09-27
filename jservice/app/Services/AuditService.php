<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Core\Auth;

class AuditService
{
    public static function log(string $action, string $details = ''): void
    {
        $user = Auth::user();
        $userId = $user ? $user->id : null;
        $userName = $user ? $user->name : 'مهمان / سیستم';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        try {
            Database::insert(
                "INSERT INTO js_audit_logs (user_id, user_name, action, details, ip_address, user_agent, created_at)
                 VALUES (:uid, :uname, :act, :det, :ip, :ua, NOW())",
                [
                    ':uid'   => $userId,
                    ':uname' => $userName,
                    ':act'   => $action,
                    ':det'   => $details,
                    ':ip'    => $ip,
                    ':ua'    => $ua
                ]
            );
        } catch (\Throwable) {
            // Fail silently so audit does not block business action
        }
    }
}
