// ========================================================
// JSERVICE - Production Shared Hosting Deployment Package
// Installer Scripts (PHP, MySQL Schema, .htaccess, Config)
// ========================================================

export const DATABASE_SQL_CODE = `-- ========================================================
-- JSERVICE ERP - Database Schema (MySQL / MariaDB)
-- سازگار با هاست‌های اشتراکی cPanel / DirectAdmin / Plesk
-- Charset: utf8mb4 / Collation: utf8mb4_persian_ci
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. جدول کاربران (Users)
CREATE TABLE IF NOT EXISTS \`js_users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`mobile\` VARCHAR(20) NOT NULL UNIQUE,
  \`email\` VARCHAR(191) NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(50) NOT NULL DEFAULT 'technician',
  \`role_title\` VARCHAR(100) NOT NULL DEFAULT 'تکنسین',
  \`branch_id\` INT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`avatar_url\` VARCHAR(255) NULL,
  \`last_login\` DATETIME NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_user_mobile\` (\`mobile\`),
  INDEX \`idx_user_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 2. جدول شعب و نمایندگی‌ها (Branches)
CREATE TABLE IF NOT EXISTS \`js_branches\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(191) NOT NULL,
  \`type\` ENUM('central', 'branch', 'agency') NOT NULL DEFAULT 'branch',
  \`manager_name\` VARCHAR(191) NOT NULL,
  \`province\` VARCHAR(100) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`max_daily_intake\` INT NOT NULL DEFAULT 30,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 3. جدول مشتریان (Customers & CRM)
CREATE TABLE IF NOT EXISTS \`js_customers\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`company_name\` VARCHAR(191) NULL,
  \`mobile\` VARCHAR(20) NOT NULL UNIQUE,
  \`phone\` VARCHAR(50) NULL,
  \`national_code\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(191) NULL,
  \`province\` VARCHAR(100) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`postal_code\` VARCHAR(20) NULL,
  \`customer_type\` ENUM('real', 'legal') NOT NULL DEFAULT 'real',
  \`source\` VARCHAR(50) NOT NULL DEFAULT 'walk-in',
  \`vip_level\` ENUM('normal', 'silver', 'gold', 'platinum') NOT NULL DEFAULT 'normal',
  \`balance\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`notes\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_cust_mobile\` (\`mobile\`),
  INDEX \`idx_cust_national\` (\`national_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 4. جدول برندها و دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS \`js_brands\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(191) NOT NULL,
  \`country\` VARCHAR(100) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

CREATE TABLE IF NOT EXISTS \`js_categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(191) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 5. جدول کالاها (Products)
CREATE TABLE IF NOT EXISTS \`js_products\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`brand_id\` INT NOT NULL,
  \`category_id\` INT NOT NULL,
  \`name\` VARCHAR(191) NOT NULL,
  \`model\` VARCHAR(100) NOT NULL,
  \`sku\` VARCHAR(100) NOT NULL UNIQUE,
  \`default_warranty_months\` INT NOT NULL DEFAULT 18,
  \`description\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`brand_id\`) REFERENCES \`js_brands\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`category_id\`) REFERENCES \`js_categories\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 6. جدول سریال‌ها - موجودیت مستقل و قلب سیستم (Serials)
CREATE TABLE IF NOT EXISTS \`js_serials\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`serial_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`imei\` VARCHAR(50) NULL,
  \`batch_number\` VARCHAR(50) NULL,
  \`product_id\` INT NOT NULL,
  \`customer_id\` INT NULL,
  \`branch_id\` INT NOT NULL,
  \`production_date\` DATE NULL,
  \`sale_date\` DATE NULL,
  \`warranty_type\` ENUM('corporate', 'branch', 'extended', 'part', 'repair', 'none') NOT NULL DEFAULT 'corporate',
  \`warranty_status\` ENUM('active', 'expired', 'voided', 'not_activated') NOT NULL DEFAULT 'active',
  \`warranty_start_date\` DATE NULL,
  \`warranty_end_date\` DATE NULL,
  \`status\` ENUM('in_stock', 'sold', 'in_service', 'replaced', 'scrapped') NOT NULL DEFAULT 'in_stock',
  \`void_reason\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_serial_num\` (\`serial_number\`),
  INDEX \`idx_serial_imei\` (\`imei\`),
  FOREIGN KEY (\`product_id\`) REFERENCES \`js_products\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 7. جدول تاریخچه سریال (Serial Lifecycle History)
CREATE TABLE IF NOT EXISTS \`js_serial_history\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`serial_id\` INT NOT NULL,
  \`event_type\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(191) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`operator_name\` VARCHAR(100) NOT NULL,
  \`reference_code\` VARCHAR(100) NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`serial_id\`) REFERENCES \`js_serials\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 8. جدول جاب و گردش کار پذیرش (Jobs & Workflows)
CREATE TABLE IF NOT EXISTS \`js_jobs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tracking_code\` VARCHAR(50) NOT NULL UNIQUE, -- JS-1403-000001
  \`local_reception_number\` VARCHAR(50) NOT NULL,
  \`customer_id\` INT NOT NULL,
  \`serial_id\` INT NOT NULL,
  \`branch_id\` INT NOT NULL,
  \`assigned_technician_id\` INT NULL,
  \`channel\` ENUM('walk-in', 'branch', 'phone', 'online') NOT NULL DEFAULT 'walk-in',
  \`priority\` ENUM('normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
  \`warranty_condition\` ENUM('under_warranty', 'out_of_warranty', 'pending_inspection') NOT NULL DEFAULT 'under_warranty',
  \`customer_complaint\` TEXT NOT NULL,
  \`expert_initial_notes\` TEXT NULL,
  \`visual_condition\` JSON NULL,
  \`accessories\` JSON NULL,
  \`signature_data\` MEDIUMTEXT NULL,
  \`current_status\` VARCHAR(50) NOT NULL DEFAULT 'registered',
  \`estimated_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`final_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`is_warranty_approved_tech\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_warranty_approved_manager\` TINYINT(1) NOT NULL DEFAULT 0,
  \`warranty_rejection_reason\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_job_tracking\` (\`tracking_code\`),
  INDEX \`idx_job_status\` (\`current_status\`),
  FOREIGN KEY (\`customer_id\`) REFERENCES \`js_customers\`(\`id\`),
  FOREIGN KEY (\`serial_id\`) REFERENCES \`js_serials\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 9. جدول تایم‌لاین رویدادهای جاب (Job Timeline)
CREATE TABLE IF NOT EXISTS \`js_job_timeline\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`job_id\` INT NOT NULL,
  \`status\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(191) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`operator_name\` VARCHAR(100) NOT NULL,
  \`user_role\` VARCHAR(50) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`job_id\`) REFERENCES \`js_jobs\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 10. جدول انبارها و قطعات (Warehouses & Parts)
CREATE TABLE IF NOT EXISTS \`js_warehouses\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(191) NOT NULL,
  \`type\` ENUM('central', 'service', 'branch', 'technician', 'scrap', 'quarantine', 'salvage') NOT NULL,
  \`manager_name\` VARCHAR(100) NOT NULL,
  \`location\` VARCHAR(191) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

CREATE TABLE IF NOT EXISTS \`js_parts\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(100) NOT NULL UNIQUE,
  \`name\` VARCHAR(191) NOT NULL,
  \`brand_name\` VARCHAR(100) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`compatible_models\` TEXT NULL,
  \`barcode\` VARCHAR(100) NOT NULL UNIQUE,
  \`storage_bin\` VARCHAR(50) NOT NULL,
  \`unit\` VARCHAR(20) NOT NULL DEFAULT 'عدد',
  \`buy_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`sell_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`min_stock\` INT NOT NULL DEFAULT 5,
  \`current_stock\` INT NOT NULL DEFAULT 0,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_part_barcode\` (\`barcode\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 11. جدول درخواست‌های قطعه تکنسین (Part Requests)
CREATE TABLE IF NOT EXISTS \`js_part_requests\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`job_id\` INT NOT NULL,
  \`part_id\` INT NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`requested_by\` INT NOT NULL,
  \`warehouse_id\` INT NOT NULL,
  \`status\` ENUM('pending', 'approved', 'rejected', 'delivered') NOT NULL DEFAULT 'pending',
  \`rejection_reason\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`job_id\`) REFERENCES \`js_jobs\`(\`id\`),
  FOREIGN KEY (\`part_id\`) REFERENCES \`js_parts\`(\`id\`),
  FOREIGN KEY (\`warehouse_id\`) REFERENCES \`js_warehouses\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 12. جدول قطعات داغی و مستعمل (Scrap Parts)
CREATE TABLE IF NOT EXISTS \`js_scrap_parts\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`part_id\` INT NOT NULL,
  \`job_id\` INT NOT NULL,
  \`technician_id\` INT NOT NULL,
  \`condition_status\` ENUM('in_review', 'repairable', 'scrapped', 'returned_to_vendor') NOT NULL DEFAULT 'in_review',
  \`notes\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 13. جدول مالی و فاکتورها (Invoices & Payments)
CREATE TABLE IF NOT EXISTS \`js_invoices\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`invoice_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`job_id\` INT NOT NULL,
  \`customer_id\` INT NOT NULL,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty_discount_total\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`tax\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total_payable\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`paid_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('draft', 'pending_payment', 'paid', 'canceled') NOT NULL DEFAULT 'draft',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`job_id\`) REFERENCES \`js_jobs\`(\`id\`),
  FOREIGN KEY (\`customer_id\`) REFERENCES \`js_customers\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 14. جدول لاگ پیامک (SMS Logs)
CREATE TABLE IF NOT EXISTS \`js_sms_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`mobile\` VARCHAR(20) NOT NULL,
  \`recipient_name\` VARCHAR(100) NOT NULL,
  \`event\` VARCHAR(50) NOT NULL,
  \`message_text\` TEXT NOT NULL,
  \`status\` ENUM('delivered', 'sent', 'failed') NOT NULL DEFAULT 'sent',
  \`provider\` VARCHAR(50) NOT NULL DEFAULT 'kavenegar',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 15. جدول تنظیمات و لایسنس سیستم (System Settings & License)
CREATE TABLE IF NOT EXISTS \`js_settings\` (
  \`setting_key\` VARCHAR(100) PRIMARY KEY,
  \`setting_value\` LONGTEXT NULL,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 16. جدول اعزام و سرویس در محل (On-Site Field Dispatch)
CREATE TABLE IF NOT EXISTS \`js_onsite_dispatches\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tracking_code\` VARCHAR(50) NOT NULL,
  \`job_id\` INT NULL,
  \`customer_name\` VARCHAR(191) NOT NULL,
  \`customer_mobile\` VARCHAR(20) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`province\` VARCHAR(100) NOT NULL DEFAULT 'تهران',
  \`city\` VARCHAR(100) NOT NULL DEFAULT 'تهران',
  \`district\` VARCHAR(100) NULL,
  \`scheduled_date\` VARCHAR(50) NOT NULL,
  \`time_slot\` ENUM('morning', 'afternoon', 'evening') NOT NULL DEFAULT 'morning',
  \`technician_id\` INT NULL,
  \`technician_name\` VARCHAR(191) NOT NULL,
  \`travel_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 350000.00,
  \`zone\` ENUM('inside_city', 'suburbs', 'intercity') NOT NULL DEFAULT 'inside_city',
  \`status\` ENUM('scheduled', 'technician_en_route', 'arrived', 'completed', 'canceled') NOT NULL DEFAULT 'scheduled',
  \`notes\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_onsite_tech\` (\`technician_id\`),
  INDEX \`idx_onsite_date\` (\`scheduled_date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 17. جدول انبارک سیار تکنسین و قطعات امانی (Technician Mobile Van Stock)
CREATE TABLE IF NOT EXISTS \`js_technician_van_inventory\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`technician_id\` INT NOT NULL,
  \`part_id\` INT NOT NULL,
  \`quantity_on_hand\` INT NOT NULL DEFAULT 0,
  \`consigned_date\` DATE NOT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'active',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_van_tech\` (\`technician_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 18. جدول راهنمای عیب‌یابی و کدهای خطا (Diagnostic Decision Tree & Error Codes)
CREATE TABLE IF NOT EXISTS \`js_fault_tree_guides\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`category\` VARCHAR(100) NOT NULL,
  \`brand\` VARCHAR(100) NOT NULL,
  \`model\` VARCHAR(100) NOT NULL,
  \`error_code\` VARCHAR(100) NOT NULL,
  \`symptom\` TEXT NOT NULL,
  \`possible_causes\` JSON NULL,
  \`step_by_step_test\` JSON NULL,
  \`recommended_part\` VARCHAR(191) NULL,
  \`estimated_repair_time_min\` INT NOT NULL DEFAULT 30,
  INDEX \`idx_err_code\` (\`error_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 19. جدول نظرسنجی و رضایت‌سنجی هوشمند (CSAT Customer Feedback & Surveys)
CREATE TABLE IF NOT EXISTS \`js_csat_surveys\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`job_id\` INT NULL,
  \`tracking_code\` VARCHAR(50) NOT NULL,
  \`customer_name\` VARCHAR(191) NOT NULL,
  \`customer_mobile\` VARCHAR(20) NOT NULL,
  \`technician_id\` INT NULL,
  \`rating\` INT NOT NULL DEFAULT 5,
  \`punctuality_score\` INT NOT NULL DEFAULT 5,
  \`behavior_score\` INT NOT NULL DEFAULT 5,
  \`quality_score\` INT NOT NULL DEFAULT 5,
  \`feedback\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_csat_tech\` (\`technician_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 20. جدول فعال‌سازی آنلاین گارانتی توسط مصرف‌کننده (Consumer Warranty Activations)
CREATE TABLE IF NOT EXISTS \`js_warranty_activations\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`serial_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`product_name\` VARCHAR(191) NOT NULL,
  \`model\` VARCHAR(100) NOT NULL,
  \`customer_name\` VARCHAR(191) NOT NULL,
  \`customer_mobile\` VARCHAR(20) NOT NULL,
  \`customer_national_code\` VARCHAR(20) NOT NULL,
  \`purchase_date\` VARCHAR(50) NOT NULL,
  \`dealer_store_name\` VARCHAR(191) NOT NULL,
  \`invoice_number\` VARCHAR(100) NOT NULL,
  \`warranty_months\` INT NOT NULL DEFAULT 18,
  \`warranty_start_date\` VARCHAR(50) NOT NULL,
  \`warranty_end_date\` VARCHAR(50) NOT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'activated',
  \`activation_code\` VARCHAR(50) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_wact_serial\` (\`serial_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 21. جدول لاگ‌های امنیتی سیستم (Audit Log Trail)
CREATE TABLE IF NOT EXISTS \`js_audit_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NULL,
  \`user_name\` VARCHAR(191) NULL,
  \`action\` VARCHAR(100) NOT NULL,
  \`details\` TEXT NULL,
  \`ip_address\` VARCHAR(50) NULL,
  \`user_agent\` TEXT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_audit_user\` (\`user_id\`),
  INDEX \`idx_audit_action\` (\`action\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 22. جدول مقابله با حملات Brute-Force ورود
CREATE TABLE IF NOT EXISTS \`js_login_attempts\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`mobile\` VARCHAR(20) NOT NULL,
  \`ip_address\` VARCHAR(50) NOT NULL,
  \`attempt_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_brute_ip\` (\`ip_address\`, \`attempt_time\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

SET FOREIGN_KEY_CHECKS = 1;
`;

export const INSTALL_PHP_CODE = `<?php
/**
 * ====================================================================
 * JSERVICE ERP - Standalone Shared Hosting Web Installer (نصاب خودکار)
 * سازگار با cPanel, DirectAdmin, Plesk, XAMPP, Nginx/Apache
 * PHP Version: >= 7.4 | Database: MySQL 5.7+ / MariaDB 10.3+
 * ====================================================================
 */

header('Content-Type: text/html; charset=UTF-8');
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

$lockFile = __DIR__ . '/installed.lock';
if (file_exists($lockFile)) {
    die("
    <!DOCTYPE html>
    <html dir='rtl' lang='fa'>
    <head>
        <meta charset='UTF-8'>
        <title>سیستم قبلاً نصب شده است</title>
        <style>
            body { font-family: Tahoma, Arial, sans-serif; background: #f8fafc; text-align: center; padding: 60px 20px; color: #1e293b; direction: rtl; }
            .box { max-width: 550px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            h2 { color: #e11d48; margin-top: 0; }
            p { line-height: 1.8; color: #475569; }
            .btn { display: inline-block; margin-top: 20px; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='box'>
            <h2>⚠️ سامانه JSERVICE قبلاً با موفقیت نصب شده است!</h2>
            <p>جهت حفظ امنیت، فایل <code>install.php</code> قفل شده است.<br>اگر مایل به نصب مجدد هستید، فایل <code>installed.lock</code> را از هاست خود حذف کنید.</p>
            <a href='./' class='btn'>ورود به سامانه جی سرویس</a>
        </div>
    </body>
    </html>
    ");
}

$step = isset($_GET['step']) ? intval($_GET['step']) : 1;
$error = '';
$success = '';

// Check Requirements
$reqs = [
    'php' => [
        'title' => 'نسخه PHP (حداقل 7.4)',
        'pass' => version_compare(PHP_VERSION, '7.4.0', '>='),
        'current' => PHP_VERSION
    ],
    'pdo' => [
        'title' => 'افزونه PDO MySQL',
        'pass' => extension_loaded('pdo') && extension_loaded('pdo_mysql'),
        'current' => extension_loaded('pdo_mysql') ? 'فعال' : 'غیرفعال'
    ],
    'json' => [
        'title' => 'افزونه JSON',
        'pass' => extension_loaded('json'),
        'current' => extension_loaded('json') ? 'فعال' : 'غیرفعال'
    ],
    'curl' => [
        'title' => 'افزونه cURL (برای پیامک و لایسنس)',
        'pass' => extension_loaded('curl'),
        'current' => extension_loaded('curl') ? 'فعال' : 'غیرفعال'
    ],
    'writable' => [
        'title' => 'دسترسی نوشتن دایرکتوری اصلی',
        'pass' => is_writable(__DIR__),
        'current' => is_writable(__DIR__) ? 'قابل نوشتن (755/777)' : 'فقط خواندنی'
    ]
];

$allReqsPassed = true;
foreach ($reqs as $r) {
    if (!$r['pass']) {
        $allReqsPassed = false;
        break;
    }
}

// Processing Steps
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($step === 2) {
        $dbHost = trim($_POST['db_host'] ?? 'localhost');
        $dbPort = trim($_POST['db_port'] ?? '3306');
        $dbName = trim($_POST['db_name'] ?? '');
        $dbUser = trim($_POST['db_user'] ?? '');
        $dbPass = $_POST['db_pass'] ?? '';

        if (empty($dbName) || empty($dbUser)) {
            $error = 'لطفاً نام دیتابیس و نام کاربری را وارد فرمایید.';
        } else {
            try {
                $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
                $pdo = new PDO($dsn, $dbUser, $dbPass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);

                // Create Database if not exists
                $pdo->exec("CREATE DATABASE IF NOT EXISTS \`{$dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci");
                $pdo->exec("USE \`{$dbName}\`");

                // Save session or temp file
                file_put_contents(__DIR__ . '/.db_tmp.json', json_encode([
                    'host' => $dbHost,
                    'port' => $dbPort,
                    'name' => $dbName,
                    'user' => $dbUser,
                    'pass' => $dbPass
                ]));

                header('Location: install.php?step=3');
                exit;
            } catch (PDOException $e) {
                $error = 'خطا در اتصال به دیتابیس MySQL: ' . htmlspecialchars($e->getMessage());
            }
        }
    } elseif ($step === 3) {
        $adminName = trim($_POST['admin_name'] ?? '');
        $adminMobile = trim($_POST['admin_mobile'] ?? '');
        $adminEmail = trim($_POST['admin_email'] ?? '');
        $adminPassword = $_POST['admin_password'] ?? '';
        $companyName = trim($_POST['company_name'] ?? 'مرکز خدمات پس از فروش جی سرویس');
        $licenseKey = trim($_POST['license_key'] ?? 'JS-ENT-FREE-SHARED-HOST');

        if (strlen($adminPassword) < 8) {
            $error = 'رمز عبور مدیر باید حداقل ۸ کاراکتر باشد.';
        } elseif (empty($adminMobile)) {
            $error = 'شماره موبایل مدیر الزامی است.';
        } else {
            $tmpFile = __DIR__ . '/.db_tmp.json';
            if (!file_exists($tmpFile)) {
                header('Location: install.php?step=2');
                exit;
            }

            $dbConf = json_decode(file_get_contents($tmpFile), true);

            try {
                $dsn = "mysql:host={$dbConf['host']};port={$dbConf['port']};dbname={$dbConf['name']};charset=utf8mb4";
                $pdo = new PDO($dsn, $dbConf['user'], $dbConf['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);

                // Run SQL Schema
                $sqlPath = __DIR__ . '/database.sql';
                if (file_exists($sqlPath)) {
                    $sql = file_get_contents($sqlPath);
                    $pdo->exec($sql);
                }

                // Insert Super-Admin
                $hash = password_hash($adminPassword, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("INSERT INTO js_users (name, mobile, email, password_hash, role, role_title, is_active, created_at)
                    VALUES (:name, :mobile, :email, :hash, 'super-admin', 'مدیر کل سیستم', 1, NOW())
                    ON DUPLICATE KEY UPDATE password_hash = :hash2");
                $stmt->execute([
                    ':name' => $adminName ?: 'مدیر ارشد',
                    ':mobile' => $adminMobile,
                    ':email' => $adminEmail ?: 'admin@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
                    ':hash' => $hash,
                    ':hash2' => $hash
                ]);

                // Generate config.php
                $configContent = "<?php
/**
 * JSERVICE ERP - Production Database & App Configuration
 * تولید شده خودکار توسط نصاب در تاریخ " . date('Y-m-d H:i:s') . "
 */
define('DB_HOST', '{$dbConf['host']}');
define('DB_PORT', '{$dbConf['port']}');
define('DB_NAME', '{$dbConf['name']}');
define('DB_USER', '{$dbConf['user']}');
define('DB_PASS', '{$dbConf['pass']}');
define('APP_NAME', '{$companyName}');
define('LICENSE_KEY', '{$licenseKey}');
define('APP_KEY', '" . bin2hex(random_bytes(16)) . "');

function getDBConnection() {
    static \$pdo = null;
    if (\$pdo === null) {
        \$dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        \$pdo = new PDO(\$dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }
    return \$pdo;
}
";
                file_put_contents(__DIR__ . '/config.php', $configContent);

                // Create installed.lock
                file_put_contents($lockFile, "Installed on " . date('Y-m-d H:i:s') . " by " . $adminMobile);

                // Clean tmp
                @unlink($tmpFile);

                header('Location: install.php?step=4');
                exit;
            } catch (Exception $e) {
                $error = 'خطا در نصب و اجرای پایگاه داده: ' . htmlspecialchars($e->getMessage());
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نصب و راه‌اندازی JSERVICE روی هاست اشتراکی</title>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />
    <style>
        * { box-sizing: border-box; font-family: 'Vazirmatn', Tahoma, sans-serif; }
        body { background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .installer-card { width: 100%; max-width: 680px; background: #1e293b; border-radius: 20px; border: 1px solid #334155; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; }
        .header { background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 30px; text-align: center; }
        .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #fff; }
        .header p { margin: 0; font-size: 14px; color: #bfdbfe; }
        .steps { display: flex; background: #0f172a; border-bottom: 1px solid #334155; }
        .step-item { flex: 1; padding: 14px; text-align: center; font-size: 13px; color: #64748b; border-bottom: 3px solid transparent; }
        .step-item.active { color: #60a5fa; border-bottom-color: #3b82f6; font-weight: bold; background: #1e293b; }
        .step-item.completed { color: #34d399; }
        .content { padding: 30px; }
        .alert-error { background: #ef444420; border: 1px solid #ef4444; color: #fca5a5; padding: 14px; border-radius: 10px; margin-bottom: 20px; font-size: 14px; }
        .req-list { list-style: none; padding: 0; margin: 0; }
        .req-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #0f172a; border-radius: 10px; margin-bottom: 10px; border: 1px solid #334155; }
        .badge-success { background: #065f46; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
        .badge-danger { background: #991b1b; color: #fca5a5; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #cbd5e1; }
        .form-control { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 14px; transition: border 0.2s; }
        .form-control:focus { outline: none; border-color: #3b82f6; }
        .btn-primary { display: block; width: 100%; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; transition: background 0.2s; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-primary:disabled { background: #475569; cursor: not-allowed; }
        .hint { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .success-box { text-align: center; padding: 20px 0; }
        .success-icon { width: 70px; height: 70px; background: #065f46; color: #34d399; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 20px; }
    </style>
</head>
<body>

<div class="installer-card">
    <div class="header">
        <h1>سامانه جامع خدمات پس از فروش و گارانتی جی سرویس</h1>
        <p>نصاب استاندارد و سریع ویژه هاست‌های اشتراکی cPanel / DirectAdmin</p>
    </div>

    <div class="steps">
        <div class="step-item <?= $step === 1 ? 'active' : ($step > 1 ? 'completed' : '') ?>">۱. بررسی هاست</div>
        <div class="step-item <?= $step === 2 ? 'active' : ($step > 2 ? 'completed' : '') ?>">۲. اتصال پایگاه داده</div>
        <div class="step-item <?= $step === 3 ? 'active' : ($step > 3 ? 'completed' : '') ?>">۳. مدیر و لایسنس</div>
        <div class="step-item <?= $step === 4 ? 'active completed' : '' ?>">۴. اتمام نصب</div>
    </div>

    <div class="content">
        <?php if (!empty($error)): ?>
            <div class="alert-error"><?= $error ?></div>
        <?php endif; ?>

        <?php if ($step === 1): ?>
            <h3 style="margin-top: 0; font-size: 16px; color: #93c5fd;">گام اول: بررسی پیش‌نیازهای سرور و هاست اشتراکی</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.8;">
                سیستم به‌صورت خودکار قابلیت‌های PHP، ماژول‌های دیتابیس و دسترسی نوشتن فایل‌ها را روی هاست شما بررسی کرده است:
            </p>
            <ul class="req-list">
                <?php foreach ($reqs as $r): ?>
                    <li class="req-item">
                        <div>
                            <strong><?= $r['title'] ?></strong>
                            <div style="font-size: 11px; color: #64748b;"><?= $r['current'] ?></div>
                        </div>
                        <?php if ($r['pass']): ?>
                            <span class="badge-success">✓ تایید شد</span>
                        <?php else: ?>
                            <span class="badge-danger">✗ ناموفق</span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>

            <div style="margin-top: 25px;">
                <?php if ($allReqsPassed): ?>
                    <a href="install.php?step=2" class="btn-primary">ادامه و پیکربندی دیتابیس ←</a>
                <?php else: ?>
                    <button class="btn-primary" disabled>پیش‌نیازها رعایت نشده‌اند (لطفاً نسخه PHP را ارتقا دهید)</button>
                <?php endif; ?>
            </div>

        <?php elseif ($step === 2): ?>
            <h3 style="margin-top: 0; font-size: 16px; color: #93c5fd;">گام دوم: تنظیمات پایگاه داده MySQL در cPanel</h3>
            <p style="font-size: 13px; color: #94a3b8;">
                لطفاً مشخصات دیتابیسی که در کنترل‌پنل هاست خود (MySQL Database Wizard) ساخته‌اید وارد کنید:
            </p>
            <form method="POST">
                <div class="form-group">
                    <label>آدرس هاست دیتابیس (Host):</label>
                    <input type="text" name="db_host" class="form-control" value="localhost" required>
                    <div class="hint">در ۹۹٪ هاست‌های cPanel و DirectAdmin همان <code>localhost</code> است.</div>
                </div>
                <div class="form-group">
                    <label>پورت دیتابیس (Port):</label>
                    <input type="text" name="db_port" class="form-control" value="3306" required>
                </div>
                <div class="form-group">
                    <label>نام دیتابیس (Database Name):</label>
                    <input type="text" name="db_name" class="form-control" placeholder="مثال: cpaneluser_jservice" required>
                </div>
                <div class="form-group">
                    <label>نام کاربری دیتابیس (Username):</label>
                    <input type="text" name="db_user" class="form-control" placeholder="مثال: cpaneluser_dbuser" required>
                </div>
                <div class="form-group">
                    <label>رمز عبور دیتابیس (Password):</label>
                    <input type="password" name="db_pass" class="form-control" placeholder="رمز عبور ساخته‌شده در هاست">
                </div>
                <button type="submit" class="btn-primary">بررسی اتصال و مرحله بعد ←</button>
            </form>

        <?php elseif ($step === 3): ?>
            <h3 style="margin-top: 0; font-size: 16px; color: #93c5fd;">گام سوم: ایجاد حساب مدیر کل و لایسنس شرکت</h3>
            <form method="POST">
                <div class="form-group">
                    <label>نام و نام خانوادگی مدیر کل:</label>
                    <input type="text" name="admin_name" class="form-control" value="مدیر ارشد سیستم" required>
                </div>
                <div class="form-group">
                    <label>شماره موبایل مدیر (شناسه ورود یکتا):</label>
                    <input type="text" name="admin_mobile" class="form-control" placeholder="09121112233" required>
                </div>
                <div class="form-group">
                    <label>ایمیل مدیر:</label>
                    <input type="email" name="admin_email" class="form-control" placeholder="admin@domain.ir">
                </div>
                <div class="form-group">
                    <label>رمز عبور ورود به سامانه (حداقل ۸ کاراکتر):</label>
                    <input type="password" name="admin_password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>نام شرکت یا مرکز خدمات پس از فروش:</label>
                    <input type="text" name="company_name" class="form-control" value="شرکت خدمات پس از فروش پارس گستران">
                </div>
                <div class="form-group">
                    <label>کد فعال‌سازی لایسنس (اختیاری یا دیفالت):</label>
                    <input type="text" name="license_key" class="form-control" value="JS-ENT-2024-9981-FA-PRO">
                </div>
                <button type="submit" class="btn-primary">ایجاد جداول و تکمیل نصب نهایی ←</button>
            </form>

        <?php elseif ($step === 4): ?>
            <div class="success-box">
                <div class="success-icon">✓</div>
                <h2 style="color: #34d399; margin: 0 0 10px 0;">نصب JSERVICE با موفقیت به پایان رسید!</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.8;">
                    تمام جداول دیتابیس با استاندارد <code>utf8mb4_persian_ci</code> ایجاد شدند، فایل امنیتی <code>config.php</code> ساخته شد و سیستم آماده بهره‌برداری است.
                </p>
                <div style="background: #0f172a; padding: 15px; border-radius: 12px; margin: 20px 0; text-align: right; font-size: 13px; color: #94a3b8;">
                    🔒 <strong>نکته امنیتی هاست:</strong> فایل <code>installed.lock</code> جهت جلوگیری از دستکاری ناخواسته ایجاد شد. می‌توانید وارد داشبورد شوید.
                </div>
                <a href="./" class="btn-primary" style="background: #10b981;">ورود به داشبورد سامانه جی سرویس ←</a>
            </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
`;

export const HTACCESS_CODE = `# ========================================================
# JSERVICE ERP - Apache .htaccess Security & Optimization
# بهینه‌سازی هاست اشتراکی (cPanel / DirectAdmin / Apache)
# ========================================================

# 1. فعال‌سازی موتور بازنویسی آدرس‌ها
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # هدایت خودکار تمام درخواست‌ها به HTTPS در صورت وجود SSL
    # RewriteCond %{HTTPS} off
    # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # محافظت از فایل‌های سیستمی حساس
    RewriteRule ^(\\.env|\\.git|composer\\.|config\\.php|database\\.sql|installed\\.lock) - [F,L]

    # هدایت مسیرهای SPA به index.html (در صورت لود فرانت‌اند)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# 2. هدرهای امنیتی بالا (High Security Headers)
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 3. فشرده‌سازی GZIP برای بارگذاری فوق‌سریع
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript application/json
</IfModule>

# 4. جلوگیری از نمایش لیست فایل‌های دایرکتوری (Directory Listing)
Options -Indexes

# 5. مشخص کردن انکودینگ UTF-8 پیش‌فرض
AddDefaultCharset UTF-8
`;

export const CONFIG_SAMPLE_PHP = `<?php
/**
 * JSERVICE ERP - نمونه فایل تنظیمات اتصال هاست
 * نام این فایل را به config.php تغییر داده یا از نصاب install.php استفاده کنید.
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');

define('APP_NAME', 'سامانه خدمات پس از فروش جی سرویس');
define('LICENSE_KEY', 'JS-ENT-2024-9981-FA-PRO');
define('APP_DEBUG', false);

// تابع اتصال امن PDO با پشتیبانی از حروف فارسی و کاراکترهای خاص
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_persian_ci"
        ]);
    }
    return $pdo;
}
`;

export const README_INSTALL_GUIDE = `# راهنمای جامع نصب و راه‌اندازی JSERVICE روی هاست اشتراکی (cPanel / DirectAdmin)

سامانه جامع خدمات پس از فروش، گارانتی و مدیریت تعمیرات جی سرویس با هدف سازگاری ۱۰۰٪ با انواع هاست‌های اشتراکی لینوکس (سی‌پنل، دایرکت‌ادمین، پلسک و زمپ) معماری شده است.

---

## 🚀 روش اول: نصب سریع با نصاب خودکار (پیشنهادی - ۲ دقیقه)

1. وارد فایل منیجر (File Manager) هاست خود شوید و به پوشه \`public_html\` بروید.
2. کل فایل‌های دانلود شده از سامانه (یا فایل \`jservice-installer-package.zip\`) را آپلود و اکسترکت (Extract) کنید.
3. در سی‌پنل وارد بخش **MySQL Database Wizard** شوید و:
   - یک دیتابیس جدید بسازید (مثال: \`cpuser_jservice\`).
   - یک یوزر دیتابیس بسازید و رمز عبور قوی انتخاب کنید.
   - تمام دسترسی‌ها (**ALL PRIVILEGES**) را به این یوزر بدهید.
4. مرورگر خود را باز کنید و آدرس دامنه خود را به این صورت فراخوانی کنید:
   \`\`\`
   https://yourdomain.ir/install.php
   \`\`\`
5. نصاب هوشمند جی سرویس:
   - پیش‌نیازهای سرور را بررسی می‌کند.
   - با وارد کردن مشخصات دیتابیس، تمام جداول فارسی و ایندکس‌ها را خودکار می‌سازد.
   - حساب کاربری مدیر کل (Super Admin) را ایجاد کرده و فایل امنیتی \`config.php\` را تولید می‌کند.
6. کار تمام است! دکمه ورود به سامانه را بزنید.

---

## 🛠️ روش دوم: نصب دستی (Manual Installation)

اگر تمایل دارید دیتابیس را خودتان ایمپورت کنید:
1. در سی‌پنل به بخش **phpMyAdmin** بروید.
2. دیتابیس خود را انتخاب کنید و دکمه **Import** را بزنید.
3. فایل \`database.sql\` را انتخاب کرده و دکمه **Go / اجرای کوئری** را بزنید.
4. فایل \`config.sample.php\` را باز کرده، مشخصات دیتابیس را در آن وارد کنید و نام آن را به \`config.php\` تغییر دهید.
5. فایل \`.htaccess\` را در همان روت هاست قرار دهید.

---

## 🛡️ موارد امنیتی هاست‌های اشتراکی
- پس از اتمام نصب، فایل \`installed.lock\` به‌صورت خودکار ایجاد می‌شود تا هیچ فردی نتواند مجدداً نصاب را اجرا کند.
- فایل \`.htaccess\` قرار داده شده، از دسترسی مستقیم مرورگرها به فایل‌های \`.sql\`، فایل‌های کانفیگ و لاگ‌ها ممانعت می‌کند.
- حداقل نسخه پیشنهادی پی‌اچ‌پی: PHP 7.4 تا PHP 8.3.
`;
