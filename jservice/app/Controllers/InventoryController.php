<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Part;
use App\Models\Warehouse;

class InventoryController extends BaseController
{
    public function index(Request $request): Response
    {
        $parts = Part::all('stock_qty ASC');
        $warehouses = Warehouse::all('id ASC');

        if ($request->isAjax() || str_starts_with($request->getUri(), '/api/')) {
            return $this->json([
                'success' => true,
                'parts' => $parts,
                'warehouses' => $warehouses
            ]);
        }
        return $this->view('inventory/index', ['parts' => $parts, 'warehouses' => $warehouses]);
    }

    public function store(Request $request): Response
    {
        $data = $request->all();
        $code = trim($data['code'] ?? 'PRT-' . rand(1000, 9999));
        $name = trim($data['name'] ?? '');
        $stock = (int)($data['stock_qty'] ?? 0);
        $price = (float)($data['unit_price'] ?? 0);

        if (empty($name)) {
            return $this->json(['success' => false, 'error' => 'نام قطعه الزامی است.'], 422);
        }

        $id = Part::create([
            'code' => $code,
            'name' => $name,
            'category_id' => $data['category_id'] ?? null,
            'brand_id' => $data['brand_id'] ?? null,
            'stock_qty' => $stock,
            'min_stock_alert' => (int)($data['min_stock_alert'] ?? 5),
            'unit_price' => $price,
            'purchase_price' => (float)($data['purchase_price'] ?? 0),
            'bin_location' => $data['bin_location'] ?? 'A-01',
            'is_critical' => (int)($data['is_critical'] ?? 0),
        ]);

        return $this->json(['success' => true, 'id' => $id, 'message' => 'قطعه با موفقیت در انبار ثبت گردید.']);
    }

    public function updateStock(Request $request): Response
    {
        $id = (int)$request->input('id');
        $delta = (int)$request->input('delta', 0);

        $part = Part::find($id);
        if (!$part) {
            return $this->json(['success' => false, 'error' => 'قطعه یافت نشد.'], 404);
        }

        $newQty = max(0, (int)$part->stock_qty + $delta);
        $part->stock_qty = $newQty;
        $part->save();

        return $this->json(['success' => true, 'stock_qty' => $newQty, 'message' => 'موجودی به‌روزرسانی شد.']);
    }
}
