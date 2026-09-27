<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Services\WarrantyService;

class ApiController extends BaseController
{
    public function inquiry(Request $request): Response
    {
        $serial = (string) $request->input('serial');
        $res = WarrantyService::checkValidity($serial);
        return $this->json(['success' => true, 'data' => $res]);
    }

    public function jobStatus(Request $request, array $params): Response
    {
        $tracking = $params['trackingCode'] ?? '';
        $job = Database::selectOne(
            "SELECT j.*, p.name as product_name, p.model 
             FROM js_jobs j
             LEFT JOIN js_products p ON j.product_id = p.id
             WHERE j.tracking_code = :c LIMIT 1",
            [':c' => $tracking]
        );

        if (!$job) {
            return $this->json(['success' => false, 'error' => 'پرونده یافت نشد'], 404);
        }

        return $this->json(['success' => true, 'data' => $job]);
    }
}
