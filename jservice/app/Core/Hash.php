<?php
declare(strict_types=1);

namespace App\Core;

class Hash
{
    public static function make(string $password): string
    {
        if (defined('PASSWORD_ARGON2ID')) {
            return password_hash($password, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost'   => 4,
                'threads'     => 1,
            ]);
        }
        return password_hash($password, PASSWORD_BCRYPT, [
            'cost' => (int) env('BCRYPT_ROUNDS', 12)
        ]);
    }

    public static function check(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function needsRehash(string $hash): bool
    {
        $algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
        return password_needs_rehash($hash, $algo);
    }
}
