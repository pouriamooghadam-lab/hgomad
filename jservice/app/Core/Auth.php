<?php
declare(strict_types=1);

namespace App\Core;

use App\Models\User;

class Auth
{
    private static ?User $cachedUser = null;

    public static function attempt(string $identifier, string $password): bool
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        // 1. Rate Limiting Check (5 attempts in 15 minutes)
        $attempts = Database::selectOne(
            "SELECT COUNT(*) as cnt FROM js_login_attempts WHERE ip_address = :ip AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)",
            [':ip' => $ip]
        );

        if (($attempts['cnt'] ?? 0) >= 5) {
            Session::flash('error', 'به دلیل تلاش‌های ناموفق متعدد، حساب شما به مدت ۱۵ دقیقه مسدود شد.');
            return false;
        }

        // 2. Fetch User by mobile or email
        $userRecord = Database::selectOne(
            "SELECT * FROM js_users WHERE (mobile = :id OR email = :id) AND deleted_at IS NULL LIMIT 1",
            [':id' => $identifier]
        );

        if (!$userRecord || !Hash::check($password, $userRecord['password_hash'])) {
            // Log failed attempt
            Database::insert(
                "INSERT INTO js_login_attempts (mobile, ip_address, attempt_time) VALUES (:m, :ip, NOW())",
                [':m' => $identifier, ':ip' => $ip]
            );
            Session::flash('error', 'شماره همراه یا رمز عبور وارد شده نادرست است.');
            return false;
        }

        if (!$userRecord['is_active']) {
            Session::flash('error', 'حساب کاربری شما غیرفعال شده است. لطفاً با مدیر سیستم تماس بگیرید.');
            return false;
        }

        // 3. Clear failed attempts & update last login
        Database::execute("DELETE FROM js_login_attempts WHERE ip_address = :ip", [':ip' => $ip]);
        Database::execute("UPDATE js_users SET last_login = NOW() WHERE id = :id", [':id' => $userRecord['id']]);

        // 4. Log in Session & Regenerate
        Session::regenerate();
        Session::set('user_id', (int) $userRecord['id']);
        Session::set('user_role', $userRecord['role']);

        // Audit log
        Database::insert(
            "INSERT INTO js_audit_logs (user_id, user_name, action, details, ip_address, user_agent) VALUES (:uid, :uname, 'LOGIN', 'ورود موفق به سامانه', :ip, :ua)",
            [
                ':uid' => $userRecord['id'],
                ':uname' => $userRecord['name'],
                ':ip' => $ip,
                ':ua' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
            ]
        );

        return true;
    }

    public static function check(): bool
    {
        return Session::has('user_id');
    }

    public static function id(): ?int
    {
        return Session::get('user_id');
    }

    public static function user(): ?User
    {
        if (!self::check()) {
            return null;
        }

        if (self::$cachedUser === null) {
            $record = Database::selectOne(
                "SELECT * FROM js_users WHERE id = :id AND deleted_at IS NULL LIMIT 1",
                [':id' => self::id()]
            );
            if ($record) {
                self::$cachedUser = new User($record);
            }
        }

        return self::$cachedUser;
    }

    public static function hasRole(string $role): bool
    {
        $user = self::user();
        if (!$user) {
            return false;
        }
        if ($user->role === 'super-admin') {
            return true; // Super admin has all roles
        }
        return $user->role === $role;
    }

    public static function can(string $permission): bool
    {
        $user = self::user();
        if (!$user) {
            return false;
        }
        if ($user->role === 'super-admin') {
            return true; // Super admin has all permissions
        }

        // Check permission from database
        $hasPerm = Database::selectOne(
            "SELECT 1 FROM js_role_permissions rp 
             JOIN js_permissions p ON rp.permission_id = p.id 
             JOIN js_roles r ON rp.role_id = r.id 
             WHERE r.slug = :role AND p.slug = :perm LIMIT 1",
            [':role' => $user->role, ':perm' => $permission]
        );

        return (bool) $hasPerm;
    }

    public static function logout(): void
    {
        self::$cachedUser = null;
        Session::destroy();
    }
}
