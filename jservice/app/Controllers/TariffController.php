<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\ServiceTariff;

class TariffController extends BaseController
{
    public function index(Request $request): Response
    {
        $tariffs = ServiceTariff::all('category ASC, service_name ASC');
        return $this->json(['success' => true, 'data' => $tariffs]);
    }

    public function store(Request $request): Response
    {
        $code = trim($request->input('code', 'TRF-' . rand(100, 999)));
        $name = trim($request->input('service_name', ''));
        $wage = (float)$request->input('wage_amount', 0);

        if (empty($name)) {
            return $this->json(['success' => false, 'error' => 'عنوان خدمت در تعرفه الزامی است.'], 422);
        }

        $id = ServiceTariff::create([
            'code' => $code,
            'service_name' => $name,
            'category' => $request->input('category', 'تعمیر برد'),
            'device_type' => $request->input('device_type', 'عمومی'),
            'wage_amount' => $wage,
            'warranty_coverage_pct' => (int)$request->input('warranty_coverage_pct', 100),
            'estimated_minutes' => (int)$request->input('estimated_minutes', 60),
            'is_active' => 1,
        ]);

        return $this->json(['success' => true, 'id' => $id, 'message' => 'تعرفه با موفقیت اضافه شد.']);
    }
}
