<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Branch;

class BranchController extends BaseController
{
    public function index(Request $request): Response
    {
        $branches = Branch::all('id ASC');
        if ($request->isAjax() || str_starts_with($request->getUri(), '/api/')) {
            return $this->json(['success' => true, 'data' => $branches]);
        }
        return $this->view('branches/index', ['branches' => $branches]);
    }

    public function store(Request $request): Response
    {
        $data = $request->all();
        $code = trim($data['code'] ?? 'BR-' . rand(100, 999));
        $name = trim($data['name'] ?? '');
        $manager = trim($data['manager_name'] ?? '');
        $city = trim($data['city'] ?? '');
        $phone = trim($data['phone'] ?? '');

        if (empty($name) || empty($phone)) {
            return $this->json(['success' => false, 'error' => 'نام شعبه و شماره تماس الزامی است.'], 422);
        }

        $id = Branch::create([
            'code' => $code,
            'name' => $name,
            'type' => $data['type'] ?? 'branch',
            'manager_name' => $manager,
            'province' => $data['province'] ?? 'تهران',
            'city' => $city,
            'address' => $data['address'] ?? '',
            'phone' => $phone,
            'max_daily_intake' => (int)($data['max_daily_intake'] ?? 30),
            'is_active' => 1,
        ]);

        return $this->json(['success' => true, 'id' => $id, 'message' => 'شعبه با موفقیت ثبت شد.']);
    }
}
