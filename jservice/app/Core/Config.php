<?php
declare(strict_types=1);

namespace App\Core;

class Config
{
    private static array $configs = [];

    public static function get(string $key, mixed $default = null): mixed
    {
        $parts = explode('.', $key);
        $file = $parts[0];

        if (!isset(self::$configs[$file])) {
            $configPath = CONFIG_PATH . '/' . $file . '.php';
            if (file_exists($configPath)) {
                self::$configs[$file] = require $configPath;
            } else {
                return $default;
            }
        }

        $current = self::$configs[$file];
        for ($i = 1; $i < count($parts); $i++) {
            if (is_array($current) && isset($current[$parts[$i]])) {
                $current = $current[$parts[$i]];
            } else {
                return $default;
            }
        }

        return $current;
    }
}
