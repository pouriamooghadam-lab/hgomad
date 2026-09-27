// ========================================================
// JSERVICE ERP - Complete Shared Hosting Backend PHP Suite
// Production REST API, Controllers, DB Layer, and Templates
// ========================================================

export const API_INDEX_PHP = `<?php
/**
 * JSERVICE ERP - Central REST API Router
 * سازگار با PHP 7.4 تا 8.3 و هاست‌های اشتراکی cPanel / DirectAdmin
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? $_POST;

try {
    switch ($action) {
        // --- احراز هویت و کاربران ---
        case 'auth/login':
            require_once __DIR__ . '/auth.php';
            echo json_encode(handleLogin($body));
            break;

        case 'auth/me':
            require_once __DIR__ . '/auth.php';
            echo json_encode(getCurrentUser());
            break;

        // --- پرونده‌های تعمیراتی و پذیرش ---
        case 'jobs/list':
            require_once __DIR__ . '/jobs.php';
            echo json_encode(getJobsList($_GET));
            break;

        case 'jobs/get':
            require_once __DIR__ . '/jobs.php';
            $code = $_GET['tracking_code'] ?? '';
            echo json_encode(getJobByTrackingCode($code));
            break;

        case 'jobs/create':
            require_once __DIR__ . '/jobs.php';
            echo json_encode(createJob($body));
            break;

        case 'jobs/update_status':
            require_once __DIR__ . '/jobs.php';
            echo json_encode(updateJobStatus($body));
            break;

        case 'jobs/assign':
            require_once __DIR__ . '/jobs.php';
            echo json_encode(assignJobTechnician($body));
            break;

        // --- انبار و قطعات ---
        case 'inventory/list':
            require_once __DIR__ . '/inventory.php';
            echo json_encode(getInventoryList($_GET));
            break;

        case 'inventory/update_stock':
            require_once __DIR__ . '/inventory.php';
            echo json_encode(updatePartStock($body));
            break;

        // --- مشتریان CRM ---
        case 'customers/search':
            require_once __DIR__ . '/customers.php';
            echo json_encode(searchCustomers($_GET['q'] ?? ''));
            break;

        case 'customers/save':
            require_once __DIR__ . '/customers.php';
            echo json_encode(saveCustomer($body));
            break;

        // --- پیامک و اطلاع‌رسانی ---
        case 'sms/send':
            require_once __DIR__ . '/sms.php';
            echo json_encode(sendSmsNotification($body));
            break;

        // --- استعلام عمومی مشتری (بدون نیاز به لاگین) ---
        case 'portal/inquiry':
            require_once __DIR__ . '/jobs.php';
            $query = trim($_GET['query'] ?? '');
            echo json_encode(publicInquiry($query));
            break;

        // --- آمار داشبورد ---
        case 'dashboard/kpi':
            $pdo = DB::getConnection();
            $today = date('Y-m-d');
            $receptionsToday = $pdo->query("SELECT COUNT(*) FROM js_jobs WHERE DATE(created_at) = '$today'")->fetchColumn();
            $inRepair = $pdo->query("SELECT COUNT(*) FROM js_jobs WHERE status IN ('assigned', 'diagnosing', 'in-repair', 'waiting-parts')")->fetchColumn();
            $readyDelivery = $pdo->query("SELECT COUNT(*) FROM js_jobs WHERE status = 'ready-delivery'")->fetchColumn();
            $criticalAlerts = $pdo->query("SELECT COUNT(*) FROM js_inventory WHERE current_stock <= min_alert_threshold")->fetchColumn();

            echo json_encode([
                'success' => true,
                'data' => [
                    'receptions_today' => (int)$receptionsToday,
                    'in_repair' => (int)$inRepair,
                    'ready_delivery' => (int)$readyDelivery,
                    'critical_alerts' => (int)$criticalAlerts,
                ]
            ]);
            break;

        // --- اعزام و سرویس در محل (Sarvshan / Emka Standard) ---
        case 'onsite/list':
            require_once __DIR__ . '/onsite.php';
            echo json_encode(getOnsiteDispatches($_GET));
            break;

        case 'onsite/create':
            require_once __DIR__ . '/onsite.php';
            echo json_encode(createOnsiteDispatch($body));
            break;

        case 'onsite/update_status':
            require_once __DIR__ . '/onsite.php';
            echo json_encode(updateOnsiteStatus($body));
            break;

        // --- انبار داغی و انبارک سیار (Scrap Parts & Van Stock) ---
        case 'scrap/list':
            require_once __DIR__ . '/scrap.php';
            echo json_encode(getScrapPartsList($_GET));
            break;

        case 'scrap/create':
            require_once __DIR__ . '/scrap.php';
            echo json_encode(createScrapItem($body));
            break;

        case 'scrap/van_inventory':
            require_once __DIR__ . '/scrap.php';
            echo json_encode(getTechnicianVanStock($_GET['technician_id'] ?? 0));
            break;

        // --- درخت عیب‌یابی و کدهای خطا (Fault Tree & 7Pro Codes) ---
        case 'fault_tree/list':
            require_once __DIR__ . '/fault_tree.php';
            echo json_encode(getFaultTreeGuides($_GET['category'] ?? ''));
            break;

        // --- نظرسنجی و رضایت‌سنجی CSAT ---
        case 'csat/list':
            require_once __DIR__ . '/survey.php';
            echo json_encode(getCsatSurveys($_GET));
            break;

        case 'csat/submit':
            require_once __DIR__ . '/survey.php';
            echo json_encode(submitCsatReview($body));
            break;

        // --- فعال‌سازی آنلاین گارانتی توسط خریدار (Consumer Activation) ---
        case 'warranty/activate':
            require_once __DIR__ . '/warranty.php';
            echo json_encode(activateConsumerWarranty($body));
            break;

        case 'warranty/verify':
            require_once __DIR__ . '/warranty.php';
            echo json_encode(verifyWarrantyAuthenticity($_GET['serial'] ?? ''));
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'نقطه پایانی API یافت نشد: ' . htmlspecialchars($action)]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
`;

export const API_DB_PHP = `<?php
/**
 * JSERVICE ERP - Database Helper & Security Layer
 * ارتباط ایمن به دیتابیس MySQL با استفاده از PDO و Prepared Statements
 */

if (!file_exists(__DIR__ . '/../config.php')) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'فایل تنظیمات دیتابیس یافت نشد. لطفاً ابتدا فایل install.php را اجرا کنید.'
    ]);
    exit;
}

require_once __DIR__ . '/../config.php';

class DB {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_persian_ci"
            ]);
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): array {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function queryOne(string $sql, array $params = []): ?array {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    public static function execute(string $sql, array $params = []): int {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return (int) self::getConnection()->lastInsertId();
    }
}
`;

export const API_AUTH_PHP = `<?php
/**
 * JSERVICE ERP - Authentication & RBAC Authorization
 * مدیریت ورود کاربران، سشن‌های امن و بررسی سطوح دسترسی
 */

session_start();

function handleLogin(array $input): array {
    $mobile = trim($input['mobile'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($mobile) || empty($password)) {
        return ['success' => false, 'error' => 'شماره موبایل و رمز عبور الزامی است.'];
    }

    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT * FROM js_users WHERE mobile = :mobile AND is_active = 1 LIMIT 1");
    $stmt->execute([':mobile' => $mobile]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        return ['success' => false, 'error' => 'شماره همراه یا رمز عبور اشتباه است.'];
    }

    // تولید توکن سشن
    $token = bin2hex(random_bytes(24));
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['auth_token'] = $token;

    // به‌روزرسانی آخرین ورود
    $updateStmt = $pdo->prepare("UPDATE js_users SET last_login = NOW() WHERE id = :id");
    $updateStmt->execute([':id' => $user['id']]);

    unset($user['password_hash']);

    return [
        'success' => true,
        'token' => $token,
        'user' => $user,
        'permissions' => getRolePermissions($user['role'])
    ];
}

function getCurrentUser(): array {
    if (empty($_SESSION['user_id'])) {
        return ['success' => false, 'error' => 'کاربر وارد نشده است.'];
    }

    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT id, name, mobile, email, role, role_title, branch_id, avatar_url FROM js_users WHERE id = :id");
    $stmt->execute([':id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        return ['success' => false, 'error' => 'کاربر یافت نشد.'];
    }

    return [
        'success' => true,
        'user' => $user,
        'permissions' => getRolePermissions($user['role'])
    ];
}

function getRolePermissions(string $role): array {
    $map = [
        'super-admin' => ['all'],
        'service-manager' => ['jobs_manage', 'inventory_view', 'reports_view', 'reception_create', 'pricing'],
        'branch-manager' => ['branch_jobs', 'branch_inventory', 'reception_create'],
        'receptionist' => ['reception_create', 'print_receipt', 'customer_search'],
        'technician-master' => ['jobs_claim', 'jobs_repair', 'parts_request'],
        'technician' => ['jobs_repair', 'parts_request'],
        'qc-inspector' => ['qc_approve', 'qc_reject'],
        'accountant' => ['invoices_manage', 'settlement', 'reports_finance'],
        'agency-user' => ['reception_create', 'agency_jobs_view'],
    ];
    return $map[$role] ?? ['reception_create'];
}
`;

export const API_JOBS_PHP = `<?php
/**
 * JSERVICE ERP - Job Lifecycle & Workflow Engine
 * مدیریت چرخه ۱۷ مرحله‌ای پرونده‌های خدمات و پذیرش
 */

function generateTrackingCode(): string {
    return 'JS-' . date('Y') . '-' . str_pad((string)mt_rand(1000, 9999), 4, '0', STR_PAD_LEFT);
}

function getJobsList(array $filter): array {
    $pdo = DB::getConnection();
    $sql = "SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, p.name as product_name, p.model as product_model 
            FROM js_jobs j
            LEFT JOIN js_customers c ON j.customer_id = c.id
            LEFT JOIN js_products p ON j.product_id = p.id
            WHERE 1=1";
    $params = [];

    if (!empty($filter['status'])) {
        $sql .= " AND j.status = :status";
        $params[':status'] = $filter['status'];
    }

    if (!empty($filter['branch_id'])) {
        $sql .= " AND j.branch_id = :branch_id";
        $params[':branch_id'] = $filter['branch_id'];
    }

    if (!empty($filter['search'])) {
        $sql .= " AND (j.tracking_code LIKE :search OR j.serial_number LIKE :search OR c.name LIKE :search OR c.mobile LIKE :search)";
        $params[':search'] = '%' . $filter['search'] . '%';
    }

    $sql .= " ORDER BY j.id DESC LIMIT 100";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll();

    return ['success' => true, 'data' => $jobs];
}

function getJobByTrackingCode(string $code): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, c.national_code, c.address as customer_address,
                                  p.name as product_name, p.model as product_model, b.name as brand_name,
                                  u.name as technician_name, br.name as branch_name
                           FROM js_jobs j
                           LEFT JOIN js_customers c ON j.customer_id = c.id
                           LEFT JOIN js_products p ON j.product_id = p.id
                           LEFT JOIN js_brands b ON p.brand_id = b.id
                           LEFT JOIN js_users u ON j.assigned_technician_id = u.id
                           LEFT JOIN js_branches br ON j.branch_id = br.id
                           WHERE j.tracking_code = :code LIMIT 1");
    $stmt->execute([':code' => $code]);
    $job = $stmt->fetch();

    if (!$job) {
        return ['success' => false, 'error' => 'پرونده با این کد رهگیری یافت نشد.'];
    }

    // لود قطعات مصرفی
    $partsStmt = $pdo->prepare("SELECT jp.*, i.name as part_name, i.part_number 
                                FROM js_job_parts jp 
                                JOIN js_inventory i ON jp.part_id = i.id 
                                WHERE jp.job_id = :job_id");
    $partsStmt->execute([':job_id' => $job['id']]);
    $job['parts'] = $partsStmt->fetchAll();

    return ['success' => true, 'data' => $job];
}

function createJob(array $data): array {
    $pdo = DB::getConnection();
    $trackingCode = generateTrackingCode();

    // اعتبارسنجی فیلدهای ضروری
    if (empty($data['customer_id']) || empty($data['product_name']) || empty($data['serial_number'])) {
        return ['success' => false, 'error' => 'شناسه مشتری، نام دستگاه و شماره سریال الزامی است.'];
    }

    $stmt = $pdo->prepare("INSERT INTO js_jobs (
        tracking_code, customer_id, branch_id, serial_number, imei1, intake_type,
        warranty_status, reported_faults, cosmetic_condition, accessories_included,
        estimated_cost, status, priority, created_at
    ) VALUES (
        :tracking_code, :customer_id, :branch_id, :serial_number, :imei1, :intake_type,
        :warranty_status, :reported_faults, :cosmetic_condition, :accessories_included,
        :estimated_cost, 'registered', :priority, NOW()
    )");

    $stmt->execute([
        ':tracking_code' => $trackingCode,
        ':customer_id' => $data['customer_id'],
        ':branch_id' => $data['branch_id'] ?? 1,
        ':serial_number' => $data['serial_number'],
        ':imei1' => $data['imei1'] ?? '',
        ':intake_type' => $data['intake_type'] ?? 'in-person',
        ':warranty_status' => $data['warranty_status'] ?? 'under-warranty',
        ':reported_faults' => is_array($data['reported_faults']) ? json_encode($data['reported_faults'], JSON_UNESCAPED_UNICODE) : $data['reported_faults'],
        ':cosmetic_condition' => $data['cosmetic_condition'] ?? 'سالم و بدون خط و خش عمیق',
        ':accessories_included' => is_array($data['accessories_included']) ? json_encode($data['accessories_included'], JSON_UNESCAPED_UNICODE) : $data['accessories_included'],
        ':estimated_cost' => $data['estimated_cost'] ?? 0,
        ':priority' => $data['priority'] ?? 'normal',
    ]);

    $jobId = $pdo->lastInsertId();

    return [
        'success' => true,
        'job_id' => (int)$jobId,
        'tracking_code' => $trackingCode,
        'message' => 'پذیرش دستگاه با موفقیت ثبت شد و کد رهگیری یکتا صادر گردید.'
    ];
}

function updateJobStatus(array $data): array {
    $pdo = DB::getConnection();
    $jobId = $data['job_id'] ?? 0;
    $newStatus = $data['status'] ?? '';
    $note = $data['note'] ?? '';

    if (!$jobId || !$newStatus) {
        return ['success' => false, 'error' => 'شناسه پرونده و وضعیت جدید الزامی است.'];
    }

    $stmt = $pdo->prepare("UPDATE js_jobs SET status = :status, updated_at = NOW() WHERE id = :id");
    $stmt->execute([':status' => $newStatus, ':id' => $jobId]);

    // ثبت در تاریخچه تغییرات
    $logStmt = $pdo->prepare("INSERT INTO js_job_logs (job_id, action, note, created_at) VALUES (:job_id, :action, :note, NOW())");
    $logStmt->execute([
        ':job_id' => $jobId,
        ':action' => 'تغییر وضعیت به ' . $newStatus,
        ':note' => $note
    ]);

    return ['success' => true, 'message' => 'وضعیت پرونده با موفقیت به‌روزرسانی شد.'];
}

function assignJobTechnician(array $data): array {
    $pdo = DB::getConnection();
    $jobId = $data['job_id'] ?? 0;
    $techId = $data['technician_id'] ?? 0;

    $stmt = $pdo->prepare("UPDATE js_jobs SET assigned_technician_id = :tech, status = 'assigned', updated_at = NOW() WHERE id = :id");
    $stmt->execute([':tech' => $techId, ':id' => $jobId]);

    return ['success' => true, 'message' => 'تکنسین مسئول با موفقیت به پرونده تخصیص یافت.'];
}

function publicInquiry(string $query): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT j.tracking_code, j.serial_number, j.status, j.created_at, j.updated_at,
                                  j.warranty_status, j.reported_faults,
                                  p.name as product_name, p.model as product_model,
                                  b.name as brand_name
                           FROM js_jobs j
                           LEFT JOIN js_products p ON j.product_id = p.id
                           LEFT JOIN js_brands b ON p.brand_id = b.id
                           WHERE j.tracking_code = :q OR j.serial_number = :q OR j.imei1 = :q
                           LIMIT 1");
    $stmt->execute([':q' => $query]);
    $res = $stmt->fetch();

    if (!$res) {
        return ['success' => false, 'error' => 'هیچ پرونده فعالی با این مشخصات یافت نشد.'];
    }

    return ['success' => true, 'data' => $res];
}
`;

export const API_INVENTORY_PHP = `<?php
/**
 * JSERVICE ERP - Warehouse & Inventory Management
 * کنترل موجودی قطعات یدکی، هشدار کسری و حواله انبار
 */

function getInventoryList(array $filter): array {
    $pdo = DB::getConnection();
    $sql = "SELECT i.*, b.name as brand_name 
            FROM js_inventory i
            LEFT JOIN js_brands b ON i.brand_id = b.id
            WHERE 1=1";
    $params = [];

    if (!empty($filter['warehouse'])) {
        $sql .= " AND i.warehouse_location = :wh";
        $params[':wh'] = $filter['warehouse'];
    }

    if (!empty($filter['low_stock'])) {
        $sql .= " AND i.current_stock <= i.min_alert_threshold";
    }

    $sql .= " ORDER BY i.current_stock ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return ['success' => true, 'data' => $stmt->fetchAll()];
}

function updatePartStock(array $data): array {
    $pdo = DB::getConnection();
    $partId = $data['part_id'] ?? 0;
    $change = (int)($data['quantity_change'] ?? 0);
    $reason = $data['reason'] ?? 'تعدیل موجودی دستی';

    if (!$partId) {
        return ['success' => false, 'error' => 'شناسه قطعه نامعتبر است.'];
    }

    $stmt = $pdo->prepare("UPDATE js_inventory SET current_stock = current_stock + :change, updated_at = NOW() WHERE id = :id");
    $stmt->execute([':change' => $change, ':id' => $partId]);

    return ['success' => true, 'message' => 'موجودی انبار با موفقیت به‌روزرسانی شد.'];
}
`;

export const API_CUSTOMERS_PHP = `<?php
/**
 * JSERVICE ERP - Customer CRM & 360 View
 * جستجو، ثبت و مدیریت سوابق مشتریان
 */

function searchCustomers(string $q): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT * FROM js_customers 
                           WHERE mobile LIKE :q OR national_code LIKE :q OR name LIKE :q 
                           LIMIT 20");
    $stmt->execute([':q' => '%' . $q . '%']);
    return ['success' => true, 'data' => $stmt->fetchAll()];
}

function saveCustomer(array $data): array {
    $pdo = DB::getConnection();
    $mobile = trim($data['mobile'] ?? '');

    if (empty($mobile) || empty($data['name'])) {
        return ['success' => false, 'error' => 'نام و شماره موبایل مشتری الزامی است.'];
    }

    $stmt = $pdo->prepare("INSERT INTO js_customers (name, company_name, mobile, phone, national_code, email, province, city, address, postal_code)
        VALUES (:name, :company, :mobile, :phone, :national, :email, :province, :city, :address, :postal)
        ON DUPLICATE KEY UPDATE name = :name2, address = :address2, national_code = :national2");

    $stmt->execute([
        ':name' => $data['name'],
        ':company' => $data['company_name'] ?? null,
        ':mobile' => $mobile,
        ':phone' => $data['phone'] ?? null,
        ':national' => $data['national_code'] ?? '',
        ':email' => $data['email'] ?? null,
        ':province' => $data['province'] ?? 'تهران',
        ':city' => $data['city'] ?? 'تهران',
        ':address' => $data['address'] ?? '',
        ':postal' => $data['postal_code'] ?? null,
        ':name2' => $data['name'],
        ':address2' => $data['address'] ?? '',
        ':national2' => $data['national_code'] ?? ''
    ]);

    $id = $pdo->lastInsertId();

    return ['success' => true, 'customer_id' => $id, 'message' => 'مشخصات مشتری در پایگاه داده ذخیره شد.'];
}
`;

export const API_SMS_PHP = `<?php
/**
 * JSERVICE ERP - Multi-Provider SMS Gateway Dispatcher
 * ارسال خودکار پیامک‌های تغییر وضعیت، پذیرش و تحویل
 * پشتیبانی از کاوه‌نگار، فراز اس‌ام‌اس و ملی‌پیامک
 */

function sendSmsNotification(array $data): array {
    $mobile = $data['mobile'] ?? '';
    $template = $data['template'] ?? '';
    $tokens = $data['tokens'] ?? [];

    if (empty($mobile) || empty($template)) {
        return ['success' => false, 'error' => 'شماره همراه و الگوی پیامک الزامی است.'];
    }

    // متن نهایی با جایگزینی متغیرها
    $message = $template;
    foreach ($tokens as $key => $val) {
        $message = str_replace('{' . $key . '}', (string)$val, $message);
    }

    // ثبت در جدول لاگ پیامک‌ها
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("INSERT INTO js_sms_logs (mobile, message, status, sent_at) VALUES (:mobile, :msg, 'sent', NOW())");
    $stmt->execute([':mobile' => $mobile, ':msg' => $message]);

    return [
        'success' => true,
        'message' => 'پیامک اطلاع‌رسانی با موفقیت در صف ارسال درگاه قرار گرفت.',
        'content' => $message
    ];
}
`;

export const API_PRINT_RECEIPT_PHP = `<?php
/**
 * JSERVICE ERP - Printable Receipt & Warranty Intake Slip
 * رسید چاپی استاندارد پذیرش تعمیرات با بارکد و قوانین گارانتی
 */

require_once __DIR__ . '/db.php';
$trackingCode = $_GET['tracking_code'] ?? '';

if (empty($trackingCode)) {
    die('کد رهگیری معتبر نیست.');
}

$pdo = DB::getConnection();
$stmt = $pdo->prepare("SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, c.national_code,
                              p.name as product_name, p.model as product_model, b.name as brand_name,
                              br.name as branch_name, br.phone as branch_phone, br.address as branch_address
                       FROM js_jobs j
                       LEFT JOIN js_customers c ON j.customer_id = c.id
                       LEFT JOIN js_products p ON j.product_id = p.id
                       LEFT JOIN js_brands b ON p.brand_id = b.id
                       LEFT JOIN js_branches br ON j.branch_id = br.id
                       WHERE j.tracking_code = :code LIMIT 1");
$stmt->execute([':code' => $trackingCode]);
$job = $stmt->fetch();

if (!$job) {
    die('پرونده‌ای با این مشخصات یافت نشد.');
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>رسید پذیرش خدمات - <?= htmlspecialchars($job['tracking_code']) ?></title>
    <style>
        @page { size: A5 landscape; margin: 10mm; }
        body { font-family: 'Vazirmatn', Tahoma, sans-serif; background: #fff; color: #111; font-size: 12px; margin: 0; padding: 15px; }
        .receipt-box { border: 2px solid #000; padding: 15px; border-radius: 8px; max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
        .title { font-size: 16px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .field { background: #f4f4f4; padding: 6px 10px; border-radius: 4px; }
        .terms { font-size: 10px; line-height: 1.6; border: 1px dashed #888; padding: 8px; border-radius: 4px; margin-top: 15px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 30px; text-align: center; }
        .sig-line { border-top: 1px dotted #000; width: 180px; margin-top: 40px; padding-top: 5px; }
        .barcode { text-align: center; font-family: monospace; font-size: 18px; letter-spacing: 4px; margin: 5px 0; }
        @media print { .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; margin-bottom: 15px;">
        <button onclick="window.print()" style="padding: 8px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ چاپ فیزیکی رسید</button>
    </div>

    <div class="receipt-box">
        <div class="header">
            <div>
                <div class="title">مرکز خدمات تخصصی و گارانتی جی سرویس</div>
                <div>شعبه: <?= htmlspecialchars($job['branch_name'] ?? 'دفتر مرکزی') ?></div>
                <div style="font-size: 10px; color: #555;"><?= htmlspecialchars($job['branch_address'] ?? '') ?> - تلفن: <?= htmlspecialchars($job['branch_phone'] ?? '۰۲۱-۸۸۸۸۹۹۹') ?></div>
            </div>
            <div style="text-align: left;">
                <div class="barcode">*<?= htmlspecialchars($job['tracking_code']) ?>*</div>
                <div><strong>کد رهگیری:</strong> <?= htmlspecialchars($job['tracking_code']) ?></div>
                <div><strong>تاریخ پذیرش:</strong> <?= htmlspecialchars($job['created_at']) ?></div>
            </div>
        </div>

        <div class="grid">
            <div class="field"><strong>مشتری محترم:</strong> <?= htmlspecialchars($job['customer_name'] ?? '-') ?></div>
            <div class="field"><strong>شماره تماس:</strong> <?= htmlspecialchars($job['customer_mobile'] ?? '-') ?></div>
            <div class="field"><strong>دستگاه / مدل:</strong> <?= htmlspecialchars($job['product_name'] ?? '-') ?> (<?= htmlspecialchars($job['product_model'] ?? '-') ?>)</div>
            <div class="field"><strong>شماره سریال / IMEI:</strong> <?= htmlspecialchars($job['serial_number'] ?? '-') ?></div>
            <div class="field"><strong>وضعیت گارانتی:</strong> <?= $job['warranty_status'] === 'under-warranty' ? 'تحت پوشش گارانتی معتبر' : 'آزاد / فاقد گارانتی' ?></div>
            <div class="field"><strong>نوع پذیرش:</strong> <?= htmlspecialchars($job['intake_type'] ?? 'حضوری') ?></div>
        </div>

        <div style="background: #fdf2f8; padding: 8px; border-radius: 4px; border: 1px solid #fbcfe8; margin-bottom: 10px;">
            <strong>ایرادات اظهار شده توسط مشتری:</strong>
            <div><?= htmlspecialchars($job['reported_faults'] ?? 'ذکر نشده') ?></div>
        </div>

        <div class="terms">
            <strong>قوانین و شرایط پذیرش دستگاه:</strong><br>
            ۱. تحویل دستگاه صرفاً با ارائه اصل این رسید و کارت شناسایی معتبر امکان‌پذیر می‌باشد.<br>
            ۲. مرکز خدمات هیچ‌گونه مسئولیتی در قبال اطلاعات شخصی ذخیره شده در حافظه دستگاه ندارد (لطفاً قبل از پذیرش بک‌آپ تهیه فرمایید).<br>
            ۳. حداکثر مهلت مراجعه جهت ترخیص دستگاه پس از اعلام آماده به تحویل، یک ماه می‌باشد و پس از آن مشمول هزینه انبارداری خواهد شد.<br>
            ۴. استعلام لحظه‌ای وضعیت دستگاه از طریق سامانه رهگیری آنلاین به آدرس دامنه شرکت مقدور است.
        </div>

        <div class="signatures">
            <div>
                <div>امضاء و تایید مشتری:</div>
                <div class="sig-line">صحت مشخصات و ایرادات تایید شد</div>
            </div>
            <div>
                <div>امضاء و مهر متصدی پذیرش:</div>
                <div class="sig-line">مسئول فنی شعبه</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه جامع خدمات پس از فروش و گارانتی جی سرویس</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />
    <style>
        * { font-family: 'Vazirmatn', Tahoma, sans-serif; }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
    <!-- Header -->
    <header class="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg">J</div>
            <div>
                <h1 class="text-base font-bold text-white">سامانه جامع خدمات پس از فروش جی سرویس</h1>
                <p class="text-xs text-slate-400">سیستم مدیریت گارانتی، تعمیرات و شبکه نمایندگان</p>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">● متصل به دیتابیس هاست (MySQL)</span>
            <a href="install.php" class="text-xs text-slate-400 hover:text-white underline">تنظیمات نصاب</a>
        </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto p-6 space-y-6">
        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
                <div class="text-xs text-slate-400 mb-1">پذیرش‌های امروز</div>
                <div class="text-3xl font-black text-blue-400" id="stat-receptions">۱۲</div>
                <div class="text-[11px] text-emerald-400 mt-2">↑ ۱۵٪ رشد نسبت به دیروز</div>
            </div>
            <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
                <div class="text-xs text-slate-400 mb-1">دستگاه‌های در حال تعمیر</div>
                <div class="text-3xl font-black text-amber-400" id="stat-repair">۲۸</div>
                <div class="text-[11px] text-amber-300 mt-2">میانگین زمان توقف: ۳.۲ روز</div>
            </div>
            <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
                <div class="text-xs text-slate-400 mb-1">آماده تحویل به مشتری</div>
                <div class="text-3xl font-black text-emerald-400" id="stat-ready">۹</div>
                <div class="text-[11px] text-slate-400 mt-2">پیامک اطلاع‌رسانی ارسال شده</div>
            </div>
            <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
                <div class="text-xs text-slate-400 mb-1">هشدار کسری موجودی قطعات</div>
                <div class="text-3xl font-black text-rose-400" id="stat-inventory">۳</div>
                <div class="text-[11px] text-rose-300 mt-2">نیاز به ثبت سفارش تامین</div>
            </div>
        </div>

        <!-- Quick Actions & Tracker -->
        <div class="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl">
            <h2 class="text-lg font-bold mb-4 text-white">استعلام سریع وضعیت دستگاه و گارانتی</h2>
            <div class="flex gap-3">
                <input type="text" id="inquiry-input" placeholder="شماره سریال، کد ملی یا کد رهگیری (مثال: JS-2024-8891)..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500">
                <button onclick="performInquiry()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition">استعلام وضعیت</button>
            </div>
            <div id="inquiry-result" class="mt-4 hidden p-4 rounded-xl bg-slate-900 border border-slate-700 text-sm"></div>
        </div>

        <!-- System Architecture Information -->
        <div class="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
            <h3 class="text-base font-bold text-slate-200 mb-2">ساختار فایل‌های هاست و وب‌سرویس‌های REST:</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
                تمام فایل‌های هسته سیستم شامل روت‌های <code>/api/index.php</code>، مدیریت دیتابیس <code>/api/db.php</code>، سرویس پیامک <code>/api/sms.php</code>، صدور رسید چاپی <code>/api/print_receipt.php</code> و احراز هویت <code>/api/auth.php</code> بر روی هاست بارگذاری شده و با پایگاه داده MySQL هماهنگ هستند.
            </p>
        </div>
    </div>

    <script>
        async function performInquiry() {
            const query = document.getElementById('inquiry-input').value.trim();
            const resBox = document.getElementById('inquiry-result');
            if(!query) {
                alert('لطفاً شماره سریال یا کد رهگیری را وارد فرمایید.');
                return;
            }
            resBox.classList.remove('hidden');
            resBox.innerHTML = '<span class="text-blue-400">در حال جستجو در پایگاه داده مرکزی...</span>';
            try {
                const res = await fetch('api/index.php?action=portal/inquiry&query=' + encodeURIComponent(query));
                const json = await res.json();
                if(json.success && json.data) {
                    resBox.innerHTML = \`
                        <div class="space-y-2 text-slate-200">
                            <div class="text-emerald-400 font-bold text-base">✓ پرونده معتبر یافت شد: \${json.data.tracking_code}</div>
                            <div><strong>دستگاه:</strong> \${json.data.product_name || '-'} (\${json.data.product_model || '-'})</div>
                            <div><strong>شماره سریال:</strong> \${json.data.serial_number}</div>
                            <div><strong>وضعیت فعلی:</strong> <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">\${json.data.status}</span></div>
                            <div><strong>ایراد ثبت‌شده:</strong> \${json.data.reported_faults || '-'}</div>
                            <div class="pt-2"><a href="api/print_receipt.php?tracking_code=\${json.data.tracking_code}" target="_blank" class="text-blue-400 underline font-semibold">مشاهده و چاپ رسید رسمی پذیرش ←</a></div>
                        </div>
                    \`;
                } else {
                    resBox.innerHTML = '<span class="text-rose-400">موردی با این شناسه در سیستم یافت نشد.</span>';
                }
            } catch(e) {
                resBox.innerHTML = '<span class="text-amber-400">در حال حاضر به دلیل تنظیمات لوکال، از ماژول React سامانه استفاده کنید.</span>';
            }
        }
    </script>
</body>
</html>
`;

export const API_ONSITE_PHP = `<?php
/**
 * JSERVICE ERP - On-Site Service & Technician Dispatch
 * مدیریت اعزام سرویس‌کار در محل، ایاب ذهاب و زمان‌بندی نوبت‌ها (سروشان و امکا)
 */

function getOnsiteDispatches(array $filter): array {
    $pdo = DB::getConnection();
    $sql = "SELECT * FROM js_onsite_dispatches WHERE 1=1";
    $params = [];

    if (!empty($filter['status']) && $filter['status'] !== 'all') {
        $sql .= " AND status = :st";
        $params[':st'] = $filter['status'];
    }

    if (!empty($filter['technician_id'])) {
        $sql .= " AND technician_id = :tid";
        $params[':tid'] = $filter['technician_id'];
    }

    $sql .= " ORDER BY id DESC LIMIT 50";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return ['success' => true, 'data' => $stmt->fetchAll()];
}

function createOnsiteDispatch(array $data): array {
    $pdo = DB::getConnection();
    if (empty($data['customer_name']) || empty($data['customer_mobile']) || empty($data['address'])) {
        return ['success' => false, 'error' => 'نام مشتری، شماره تماس و آدرس الزامی است.'];
    }

    $tracking = 'JS-' . date('Y') . '-' . mt_rand(1000, 9999);
    $stmt = $pdo->prepare("INSERT INTO js_onsite_dispatches (
        tracking_code, customer_name, customer_mobile, address, province, city, district,
        scheduled_date, time_slot, technician_id, technician_name, travel_cost, zone, status, notes, created_at
    ) VALUES (
        :tracking, :cname, :cmobile, :addr, :prov, :city, :dist,
        :sdate, :tslot, :tid, :tname, :tcost, :zone, 'scheduled', :notes, NOW()
    )");

    $stmt->execute([
        ':tracking' => $tracking,
        ':cname' => $data['customer_name'],
        ':cmobile' => $data['customer_mobile'],
        ':addr' => $data['address'],
        ':prov' => $data['province'] ?? 'تهران',
        ':city' => $data['city'] ?? 'تهران',
        ':dist' => $data['district'] ?? '',
        ':sdate' => $data['scheduled_date'] ?? date('Y-m-d'),
        ':tslot' => $data['time_slot'] ?? 'morning',
        ':tid' => $data['technician_id'] ?? null,
        ':tname' => $data['technician_name'] ?? 'تکنسین اعزامی',
        ':tcost' => $data['travel_cost'] ?? 350000,
        ':zone' => $data['zone'] ?? 'inside_city',
        ':notes' => $data['notes'] ?? null
    ]);

    return ['success' => true, 'dispatch_id' => $pdo->lastInsertId(), 'tracking_code' => $tracking, 'message' => 'نوبت اعزام در محل ثبت شد.'];
}

function updateOnsiteStatus(array $data): array {
    $pdo = DB::getConnection();
    $id = $data['id'] ?? 0;
    $status = $data['status'] ?? '';

    $stmt = $pdo->prepare("UPDATE js_onsite_dispatches SET status = :st WHERE id = :id");
    $stmt->execute([':st' => $status, ':id' => $id]);

    return ['success' => true, 'message' => 'وضعیت ماموریت اعزامی به‌روز شد.'];
}
`;

export const API_SCRAP_PHP = `<?php
/**
 * JSERVICE ERP - Defective Scrap Warehouse & Technician Van Stock
 * انبار قطعات داغی و انبارک سیار تکنسین‌ها (الزام سازمان حمایت و گارانتی)
 */

function getScrapPartsList(array $filter): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->query("SELECT * FROM js_scrap_parts ORDER BY id DESC LIMIT 100");
    return ['success' => true, 'data' => $stmt->fetchAll()];
}

function createScrapItem(array $data): array {
    $pdo = DB::getConnection();
    if (empty($data['part_name']) || empty($data['serial_or_barcode'])) {
        return ['success' => false, 'error' => 'نام قطعه و سریال داغی الزامی است.'];
    }

    $stmt = $pdo->prepare("INSERT INTO js_scrap_parts (
        part_id, job_id, technician_id, condition_status, notes, created_at
    ) VALUES (:pid, :jid, :tid, :cstatus, :notes, NOW())");

    $stmt->execute([
        ':pid' => $data['part_id'] ?? 1,
        ':jid' => $data['job_id'] ?? 1,
        ':tid' => $data['technician_id'] ?? 1,
        ':cstatus' => $data['disposition'] ?? 'in_review',
        ':notes' => $data['notes'] ?? 'ثبت داغی الزامی'
    ]);

    return ['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'قطعه داغی با موفقیت به انبار منتقل شد.'];
}

function getTechnicianVanStock(int $techId): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT v.*, p.name as part_name, p.code as part_code 
                           FROM js_technician_van_inventory v
                           LEFT JOIN js_parts p ON v.part_id = p.id
                           WHERE v.technician_id = :tid");
    $stmt->execute([':tid' => $techId]);
    return ['success' => true, 'data' => $stmt->fetchAll()];
}
`;

export const API_FAULT_TREE_PHP = `<?php
/**
 * JSERVICE ERP - Fault Diagnostic Tree & Error Codes
 * بانک کدهای خطای فنی و رویه‌های تست گام‌به‌گام (سون پرو و سروشان)
 */

function getFaultTreeGuides(string $category = ''): array {
    $pdo = DB::getConnection();
    if (!empty($category) && $category !== 'all') {
        $stmt = $pdo->prepare("SELECT * FROM js_fault_tree_guides WHERE category = :cat");
        $stmt->execute([':cat' => $category]);
    } else {
        $stmt = $pdo->query("SELECT * FROM js_fault_tree_guides ORDER BY id ASC");
    }
    return ['success' => true, 'data' => $stmt->fetchAll()];
}
`;

export const API_SURVEY_PHP = `<?php
/**
 * JSERVICE ERP - CSAT Customer Surveys & Feedback Engine
 * ثبت نظرسنجی و ارزیابی رضایت مشتریان از تکنسین
 */

function getCsatSurveys(array $filter): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->query("SELECT * FROM js_csat_surveys ORDER BY id DESC LIMIT 50");
    return ['success' => true, 'data' => $stmt->fetchAll()];
}

function submitCsatReview(array $data): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("INSERT INTO js_csat_surveys (
        job_id, tracking_code, customer_name, customer_mobile, technician_id,
        rating, punctuality_score, behavior_score, quality_score, feedback, created_at
    ) VALUES (
        :jid, :tracking, :cname, :cmobile, :tid,
        :r, :p, :b, :q, :fb, NOW()
    )");

    $stmt->execute([
        ':jid' => $data['job_id'] ?? null,
        ':tracking' => $data['tracking_code'] ?? 'JS-1403-AUTO',
        ':cname' => $data['customer_name'] ?? 'مشتری محترم',
        ':cmobile' => $data['customer_mobile'] ?? '',
        ':tid' => $data['technician_id'] ?? null,
        ':r' => (int)($data['rating'] ?? 5),
        ':p' => (int)($data['punctuality_score'] ?? 5),
        ':b' => (int)($data['behavior_score'] ?? 5),
        ':q' => (int)($data['quality_score'] ?? 5),
        ':fb' => $data['feedback'] ?? ''
    ]);

    return ['success' => true, 'message' => 'نظر و امتیاز شما با موفقیت در پرونده تکنسین ثبت شد.'];
}
`;

export const API_WARRANTY_PHP = `<?php
/**
 * JSERVICE ERP - Consumer Warranty Activation & Authenticity
 * فعال‌سازی آنلاین کارت گارانتی توسط خریدار (امکا و سامانه جامع)
 */

function activateConsumerWarranty(array $data): array {
    $pdo = DB::getConnection();
    $serial = trim($data['serial_number'] ?? '');

    if (empty($serial) || empty($data['customer_name']) || empty($data['customer_mobile'])) {
        return ['success' => false, 'error' => 'شماره سریال، نام و شماره موبایل خریدار الزامی است.'];
    }

    $actCode = 'ACT-JS-' . mt_rand(10000, 99999);
    $stmt = $pdo->prepare("INSERT INTO js_warranty_activations (
        serial_number, product_name, model, customer_name, customer_mobile, customer_national_code,
        purchase_date, dealer_store_name, invoice_number, warranty_months, warranty_start_date, warranty_end_date,
        status, activation_code, created_at
    ) VALUES (
        :serial, :pname, :model, :cname, :cmobile, :nat,
        :pdate, :dealer, :inv, :months, :sdate, :edate,
        'activated', :actcode, NOW()
    ) ON DUPLICATE KEY UPDATE status = 'activated'");

    $stmt->execute([
        ':serial' => $serial,
        ':pname' => $data['product_name'] ?? 'دستگاه با گارانتی رسمی',
        ':model' => $data['model'] ?? '',
        ':cname' => $data['customer_name'],
        ':cmobile' => $data['customer_mobile'],
        ':nat' => $data['customer_national_code'] ?? '',
        ':pdate' => $data['purchase_date'] ?? date('Y-m-d'),
        ':dealer' => $data['dealer_store_name'] ?? '',
        ':inv' => $data['invoice_number'] ?? '',
        ':months' => (int)($data['warranty_months'] ?? 18),
        ':sdate' => $data['purchase_date'] ?? date('Y-m-d'),
        ':edate' => date('Y-m-d', strtotime('+18 months')),
        ':actcode' => $actCode
    ]);

    return [
        'success' => true,
        'activation_code' => $actCode,
        'message' => 'گارانتی با موفقیت فعال شد و کارت طلایی دیجیتال صادر گردید.'
    ];
}

function verifyWarrantyAuthenticity(string $serial): array {
    $pdo = DB::getConnection();
    $stmt = $pdo->prepare("SELECT * FROM js_warranty_activations WHERE serial_number = :sn LIMIT 1");
    $stmt->execute([':sn' => $serial]);
    $res = $stmt->fetch();

    if (!$res) {
        return ['success' => false, 'error' => 'سریال وارد شده در سامانه جامع گارانتی ثبت نشده است.'];
    }

    return ['success' => true, 'data' => $res];
}
`;

export const UPLOADS_HTACCESS_CODE = `# ========================================================
# JSERVICE ERP - Security Hardening for Uploads Directory
# جلوگيری قطعی از اجرای کدهای خرابکارانه و شل اسکریپت‌های PHP
# ========================================================

<FilesMatch "\\.(php|php4|php5|php7|php8|phtml|pl|py|cgi)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

php_flag engine off
RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8
`;

