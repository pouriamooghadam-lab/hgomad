<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Invoice;
use App\Models\Job;

class InvoiceController extends BaseController
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::all('id DESC');
        return $this->json(['success' => true, 'data' => $invoices]);
    }

    public function store(Request $request): Response
    {
        $jobId = (int)$request->input('job_id');
        $customerId = (int)$request->input('customer_id');
        $partsTotal = (float)$request->input('parts_total', 0);
        $wageTotal = (float)$request->input('wage_total', 0);
        $discount = (float)$request->input('discount_amount', 0);
        $taxPct = (float)$request->input('tax_percent', 10.0); // Standard 10% Iranian VAT

        $subtotal = $partsTotal + $wageTotal - $discount;
        $taxAmount = round($subtotal * ($taxPct / 100));
        $grandTotal = $subtotal + $taxAmount;

        $invoiceNumber = 'INV-' . date('ymd') . '-' . rand(100, 999);

        $id = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'job_id' => $jobId,
            'customer_id' => $customerId,
            'parts_total' => $partsTotal,
            'wage_total' => $wageTotal,
            'discount_amount' => $discount,
            'tax_amount' => $taxAmount,
            'grand_total' => $grandTotal,
            'payment_status' => $request->input('payment_status', 'pending'), // pending, paid, partial
            'payment_method' => $request->input('payment_method', 'pos'), // pos, cash, online, card
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->json([
            'success' => true,
            'id' => $id,
            'invoice_number' => $invoiceNumber,
            'grand_total' => $grandTotal,
            'message' => 'فاکتور رسمی با موفقیت صادر گردید.'
        ]);
    }
}
