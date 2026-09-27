<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

class Setting extends BaseModel
{
    protected static string $table = 'js_settings';

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = Database::selectOne("SELECT `value` FROM js_settings WHERE `key` = :k LIMIT 1", [':k' => $key]);
        return $row ? $row['value'] : $default;
    }

    public static function set(string $key, mixed $value): void
    {
        Database::insert(
            "INSERT INTO js_settings (\`key\`, \`value\`) VALUES (:k, :v) ON DUPLICATE KEY UPDATE \`value\` = :v2",
            [':k' => $key, ':v' => (string)$value, ':v2' => (string)$value]
        );
    }
}
