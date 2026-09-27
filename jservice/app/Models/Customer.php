<?php
declare(strict_types=1);

namespace App\Models;

class Customer extends BaseModel
{
    protected static string $table = 'js_customers';
    protected static bool $softDelete = true;
}
