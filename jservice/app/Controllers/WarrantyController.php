<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Services\WarrantyService;

class WarrantyController extends BaseController
{
    public function inquiry(Request $request): Response
    {
        $serialNumber = trim((string) $request->input('serial'));
        $result = null;

        if (!empty($serialNumber)) {
            $result = WarrantyService::checkValidity($serialNumber);
        }

        return $this->view('warranty.inquiry', [
            'serial' => $serialNumber,
            'result' => $result,
        ]);
    }

    public function activate(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            $serial = trim((string) $request->input('serial_number'));
            $name = trim((string) $request->input('customer_name'));
            $mobile = trim((string) $request->input('customer_mobile'));

            if (empty($serial) || empty($name) || empty($mobile)) {
                Session::flash('error', 'تمامی فیلدها الزامی هستند.');
                return $this->redirect('/warranty/activate');
            }

            $actCode = 'ACT-JS-' . mt_rand(10000, 99999);
            Database::insert(
                "INSERT INTO js_warranty_activations (
                    serial_number, product_name, model, customer_name, customer_mobile, customer_national_code,
                    purchase_date, dealer_store_name, invoice_number, warranty_months, warranty_start_date, warranty_end_date,
                    status, activation_code, created_at
                ) VALUES (
                    :sn, :pname, :model, :cname, :cmobile, :nat,
                    :pdate, :dealer, :inv, 18, :sdate, :edate,
                    'activated', :act, NOW()
                ) ON DUPLICATE KEY UPDATE status = 'activated'",
                [
                    ':sn'      => $serial,
                    ':pname'   => $request->input('product_name', 'دستگاه گارانتی‌دار'),
                    ':model'   => $request->input('model', ''),
                    ':cname'   => $name,
                    ':cmobile' => $mobile,
                    ':nat'     => $request->input('customer_national', ''),
                    ':pdate'   => $request->input('purchase_date', date('Y-m-d')),
                    ':dealer'  => $request->input('dealer_store_name', 'فروشگاه رسمی'),
                    ':inv'     => $request->input('invoice_number', 'INV-' . mt_rand(1000, 9999)),
                    ':sdate'   => date('Y-m-d'),
                    ':edate'   => date('Y-m-d', strtotime('+18 months')),
                    ':act'     => $actCode
                ]
            );

            Session::flash('success', "کارت گارانتی با کد فعال‌سازی {$actCode} با موفقیت صادر شد.");
            return $this->redirect('/warranty/activate');
        }

        $activations = Database::select("SELECT * FROM js_warranty_activations ORDER BY id DESC LIMIT 50");
        return $this->view('warranty.activate', ['activations' => $activations]);
    }
}
