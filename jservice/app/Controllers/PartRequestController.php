<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\PartRequest;
use App\Models\Part;

class PartRequestController extends BaseController
{
    public function index(Request $request): Response
    {
        $requests = PartRequest::all('id DESC');
        return $this->json(['success' => true, 'data' => $requests]);
    }

    public function store(Request $request): Response
    {
        $jobId = (int)$request->input('job_id');
        $partId = (int)$request->input('part_id');
        $qty = (int)$request->input('quantity', 1);
        $technicianId = (int)$request->input('technician_id');

        $part = Part::find($partId);
        if (!$part) {
            return $this->json(['success' => false, 'error' => 'قطعه نامعتبر است.'], 404);
        }

        $id = PartRequest::create([
            'job_id' => $jobId,
            'technician_id' => $technicianId,
            'part_id' => $partId,
            'quantity' => $qty,
            'status' => 'pending', // pending, approved, rejected, delivered
            'notes' => $request->input('notes', ''),
        ]);

        return $this->json(['success' => true, 'id' => $id, 'message' => 'درخواست قطعه ثبت شد و در انتظار تایید انبار است.']);
    }

    public function approve(Request $request): Response
    {
        $id = (int)$request->input('id');
        $req = PartRequest::find($id);
        if (!$req) {
            return $this->json(['success' => false, 'error' => 'درخواست یافت نشد.'], 404);
        }

        $part = Part::find((int)$req->part_id);
        if ($part && (int)$part->stock_qty >= (int)$req->quantity) {
            $part->stock_qty = (int)$part->stock_qty - (int)$req->quantity;
            $part->save();
            $req->status = 'approved';
            $req->save();
            return $this->json(['success' => true, 'message' => 'درخواست تایید و از موجودی کسر گردید.']);
        }

        return $this->json(['success' => false, 'error' => 'کسری موجودی در انبار مرکزی.'], 400);
    }
}
