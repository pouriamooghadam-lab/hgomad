<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

class Job extends BaseModel
{
    protected static string $table = 'js_jobs';
    protected static bool $softDelete = true;

    public static function generateTrackingCode(): string
    {
        $year = '1403';
        $rand = mt_rand(100000, 999999);
        return "JS-{$year}-{$rand}";
    }

    public function customer(): ?Customer
    {
        return $this->customer_id ? Customer::find((int) $this->customer_id) : null;
    }

    public function product(): ?Product
    {
        return $this->product_id ? Product::find((int) $this->product_id) : null;
    }

    public function serial(): ?Serial
    {
        return $this->serial_id ? Serial::find((int) $this->serial_id) : null;
    }

    public function logs(): array
    {
        return Database::select(
            "SELECT * FROM js_job_timeline WHERE job_id = :id ORDER BY id ASC",
            [':id' => $this->id]
        );
    }
}
