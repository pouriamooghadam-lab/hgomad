<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\FaultTree;

class FaultTreeController extends BaseController
{
    public function index(Request $request): Response
    {
        $items = FaultTree::all('parent_id ASC, id ASC');
        return $this->json(['success' => true, 'data' => $items]);
    }

    public function store(Request $request): Response
    {
        $title = trim($request->input('title', ''));
        if (empty($title)) {
            return $this->json(['success' => false, 'error' => 'عنوان ایراد الزامی است.'], 422);
        }

        $id = FaultTree::create([
            'parent_id' => $request->input('parent_id') ?: null,
            'title' => $title,
            'category' => $request->input('category', 'hardware'),
            'symptom' => $request->input('symptom', ''),
            'diagnostic_steps' => $request->input('diagnostic_steps', ''),
            'suggested_part_ids' => $request->input('suggested_part_ids', '[]'),
            'estimated_time_mins' => (int)$request->input('estimated_time_mins', 45),
        ]);

        return $this->json(['success' => true, 'id' => $id, 'message' => 'شاخه عیب‌یابی به درخت خطا افزوده شد.']);
    }
}
