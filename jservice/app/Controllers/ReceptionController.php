<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Models\Job;
use App\Models\Customer;
use App\Models\Serial;
use App\Services\SmsService;
use App\Services\WorkflowService;

class ReceptionController extends BaseController
{
    public function index(Request $request): Response
    {
        $jobs = Database::select(
            "SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, p.name as product_name, p.model
             FROM js_jobs j
             LEFT JOIN js_customers c ON j.customer_id = c.id
             LEFT JOIN js_products p ON j.product_id = p.id
             WHERE j.deleted_at IS NULL
             ORDER BY j.id DESC LIMIT 100"
        );

        return $this->view('receptions.index', ['jobs' => $jobs]);
    }

    public function create(Request $request): Response
    {
        $brands = Database::select("SELECT * FROM js_brands ORDER BY name ASC");
        $branches = Database::select("SELECT * FROM js_branches WHERE is_active = 1 ORDER BY id ASC");
        $categories = Database::select("SELECT * FROM js_categories ORDER BY name ASC");

        return $this->view('receptions.create', [
            'brands'     => $brands,
            'branches'   => $branches,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): Response
    {
        if (!$this->validateCSRF($request)) {
            Session::flash('error', 'توکن امنیتی نامعتبر است.');
            return $this->redirect('/receptions/create');
        }

        $customerName = trim((string) $request->input('customer_name'));
        $customerMobile = trim((string) $request->input('customer_mobile'));
        $serialNumber = trim((string) $request->input('serial_number'));
        $productName = trim((string) $request->input('product_name'));

        if (empty($customerName) || empty($customerMobile) || empty($serialNumber)) {
            Session::flash('error', 'نام مشتری، شماره موبایل و شماره سریال دستگاه الزامی هستند.');
            return $this->redirect('/receptions/create');
        }

        Database::beginTransaction();
        try {
            // 1. Find or create customer
            $customer = Database::selectOne("SELECT * FROM js_customers WHERE mobile = :m LIMIT 1", [':m' => $customerMobile]);
            if (!$customer) {
                $customerId = Database::insert(
                    "INSERT INTO js_customers (name, mobile, national_code, province, city, address, created_at)
                     VALUES (:name, :mobile, :nat, :prov, :city, :addr, NOW())",
                    [
                        ':name'   => $customerName,
                        ':mobile' => $customerMobile,
                        ':nat'    => $request->input('customer_national', ''),
                        ':prov'   => $request->input('province', 'تهران'),
                        ':city'   => $request->input('city', 'تهران'),
                        ':addr'   => $request->input('address', ''),
                    ]
                );
            } else {
                $customerId = $customer['id'];
            }

            // 2. Find or create serial
            $serial = Database::selectOne("SELECT * FROM js_serials WHERE serial_number = :sn LIMIT 1", [':sn' => $serialNumber]);
            if (!$serial) {
                $serialId = Database::insert(
                    "INSERT INTO js_serials (serial_number, imei, branch_id, warranty_status, created_at)
                     VALUES (:sn, :imei, :bid, 'active', NOW())",
                    [
                        ':sn'   => $serialNumber,
                        ':imei' => $request->input('imei', ''),
                        ':bid'  => Auth::user()->branch_id ?? 1
                    ]
                );
            } else {
                $serialId = $serial['id'];
            }

            // 3. Generate Unique Tracking Code
            $trackingCode = Job::generateTrackingCode();
            $localNumber = 'BR-' . date('Y') . '-' . mt_rand(100, 999);

            // 4. Create Job Record
            $jobId = Database::insert(
                "INSERT INTO js_jobs (
                    tracking_code, local_reception_number, customer_id, serial_id, branch_id,
                    channel, priority, warranty_condition, customer_complaint, expert_initial_notes,
                    current_status, estimated_cost, created_at, updated_at
                ) VALUES (
                    :tracking, :local, :cid, :sid, :bid,
                    :chan, :prio, :wcond, :comp, :notes,
                    'registered', :cost, NOW(), NOW()
                )",
                [
                    ':tracking' => $trackingCode,
                    ':local'    => $localNumber,
                    ':cid'      => $customerId,
                    ':sid'      => $serialId,
                    ':bid'      => Auth::user()->branch_id ?? 1,
                    ':chan'     => $request->input('channel', 'walk-in'),
                    ':prio'     => $request->input('priority', 'normal'),
                    ':wcond'    => $request->input('warranty_condition', 'under_warranty'),
                    ':comp'     => $request->input('customer_complaint', 'نیاز به عیب‌یابی دارد'),
                    ':notes'    => $request->input('expert_notes', ''),
                    ':cost'     => (float) $request->input('estimated_cost', 0),
                ]
            );

            // 5. Initial Timeline Log
            Database::insert(
                "INSERT INTO js_job_timeline (job_id, status, title, description, operator_name, user_role, created_at)
                 VALUES (:jid, 'registered', 'ثبت پذیرش دستگاه', 'پذیرش قطعی کالا و صدور رسید رهگیری', :op, :role, NOW())",
                [
                    ':jid'  => $jobId,
                    ':op'   => Auth::user()->name,
                    ':role' => Auth::user()->role
                ]
            );

            Database::commit();

            // 6. Send SMS Notification
            SmsService::send($customerMobile, 'reception_registered', [
                'customer_name' => $customerName,
                'tracking_code' => $trackingCode,
                'status'        => 'پذیرش شده و در صف کارشناسی'
            ]);

            Session::flash('success', "پذیرش با موفقیت ثبت شد. کد رهگیری: {$trackingCode}");
            return $this->redirect("/receptions/receipt/{$trackingCode}");

        } catch (\Throwable $e) {
            Database::rollBack();
            Session::flash('error', 'خطا در ثبت پذیرش: ' . $e->getMessage());
            return $this->redirect('/receptions/create');
        }
    }

    public function printReceipt(Request $request, array $params): Response
    {
        $code = $params['trackingCode'] ?? '';
        $job = Database::selectOne(
            "SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, c.address as customer_address,
                    s.serial_number, s.imei, b.name as branch_name, b.phone as branch_phone, b.address as branch_address
             FROM js_jobs j
             LEFT JOIN js_customers c ON j.customer_id = c.id
             LEFT JOIN js_serials s ON j.serial_id = s.id
             LEFT JOIN js_branches b ON j.branch_id = b.id
             WHERE j.tracking_code = :code LIMIT 1",
            [':code' => $code]
        );

        if (!$job) {
            return new Response('پرونده با این کد رهگیری یافت نشد.', 404);
        }

        return $this->view('receptions.receipt', ['job' => $job]);
    }
}
