<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Models\Serial;

class WarrantyService
{
    public static function checkValidity(string $serialNumber): array
    {
        $serial = Database::selectOne(
            "SELECT s.*, p.name as product_name, p.model, b.name as brand_name
             FROM js_serials s
             LEFT JOIN js_products p ON s.product_id = p.id
             LEFT JOIN js_brands b ON p.brand_id = b.id
             WHERE s.serial_number = :sn OR s.imei = :sn LIMIT 1",
            [':sn' => $serialNumber]
        );

        if (!$serial) {
            return [
                'is_valid' => false,
                'status'   => 'not_found',
                'message'  => 'شماره سریال یا IMEI در سامانه ثبت نشده است.'
            ];
        }

        $now = date('Y-m-d');
        $endDate = $serial['warranty_end_date'] ?? '1970-01-01';

        if ($serial['warranty_status'] === 'voided') {
            return [
                'is_valid' => false,
                'status'   => 'voided',
                'serial'   => $serial,
                'message'  => 'گارانتی به دلیل موارد ابطال (ضربه یا آبخوردگی) فاقد اعتبار است.'
            ];
        }

        if ($endDate >= $now) {
            return [
                'is_valid' => true,
                'status'   => 'active',
                'serial'   => $serial,
                'message'  => "تحت پوشش گارانتی معتبر تا تاریخ {$endDate}"
            ];
        }

        return [
            'is_valid' => false,
            'status'   => 'expired',
            'serial'   => $serial,
            'message'  => 'مهلت گارانتی دستگاه به پایان رسیده است.'
        ];
    }
}
