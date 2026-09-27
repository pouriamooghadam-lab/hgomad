<?php
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
                $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci");
                $pdo->exec("USE `{$dbName}`");

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
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }
    return $pdo;
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
