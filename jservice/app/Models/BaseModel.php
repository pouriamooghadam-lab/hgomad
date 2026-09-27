<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

abstract class BaseModel
{
    protected static string $table = '';
    protected static string $primaryKey = 'id';
    protected static bool $softDelete = false;

    protected array $attributes = [];

    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    public function __get(string $key): mixed
    {
        return $this->attributes[$key] ?? null;
    }

    public function __set(string $key, mixed $value): void
    {
        $this->attributes[$key] = $value;
    }

    public function toArray(): array
    {
        return $this->attributes;
    }

    public static function find(int|string $id): ?static
    {
        $table = static::$table;
        $pk = static::$primaryKey;
        $sql = "SELECT * FROM {$table} WHERE {$pk} = :id";
        if (static::$softDelete) {
            $sql .= " AND deleted_at IS NULL";
        }
        $sql .= " LIMIT 1";

        $res = Database::selectOne($sql, [':id' => $id]);
        return $res ? new static($res) : null;
    }

    public static function all(string $orderBy = 'id DESC', int $limit = 500): array
    {
        $table = static::$table;
        $sql = "SELECT * FROM {$table}";
        if (static::$softDelete) {
            $sql .= " WHERE deleted_at IS NULL";
        }
        $sql .= " ORDER BY {$orderBy} LIMIT {$limit}";

        $rows = Database::select($sql);
        return array_map(fn($row) => new static($row), $rows);
    }

    public static function create(array $data): static
    {
        $table = static::$table;
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');

        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        $params = [];
        foreach ($data as $k => $v) {
            $params[":{$k}"] = $v;
        }

        $id = Database::insert("INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})", $params);
        $data[static::$primaryKey] = $id;

        return new static($data);
    }

    public function update(array $data): bool
    {
        $table = static::$table;
        $pk = static::$primaryKey;
        $id = $this->attributes[$pk] ?? null;
        if (!$id) {
            return false;
        }

        $data['updated_at'] = date('Y-m-d H:i:s');
        $fields = [];
        $params = [':id' => $id];
        foreach ($data as $k => $v) {
            $fields[] = "{$k} = :{$k}";
            $params[":{$k}"] = $v;
            $this->attributes[$k] = $v;
        }

        $sql = "UPDATE {$table} SET " . implode(', ', $fields) . " WHERE {$pk} = :id";
        return Database::execute($sql, $params) > 0;
    }

    public function delete(): bool
    {
        $table = static::$table;
        $pk = static::$primaryKey;
        $id = $this->attributes[$pk] ?? null;
        if (!$id) {
            return false;
        }

        if (static::$softDelete) {
            return Database::execute("UPDATE {$table} SET deleted_at = NOW() WHERE {$pk} = :id", [':id' => $id]) > 0;
        }

        return Database::execute("DELETE FROM {$table} WHERE {$pk} = :id", [':id' => $id]) > 0;
    }
}
