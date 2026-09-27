<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title ?? 'سامانه جامع خدمات پس از فروش و گارانتی جی سرویس') ?></title>
    <!-- Bootstrap 5 RTL -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <!-- Font Vazirmatn -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- DataTables Bootstrap 5 -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">

    <style>
        * { font-family: 'Vazirmatn', Tahoma, sans-serif; }
        body { background-color: #f1f5f9; color: #1e293b; }
        .sidebar { width: 260px; min-height: 100vh; background-color: #0f172a; color: #94a3b8; transition: all 0.3s; }
        .sidebar .nav-link { color: #94a3b8; padding: 10px 16px; border-radius: 10px; margin-bottom: 4px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .sidebar .nav-link:hover, .sidebar .nav-link.active { color: #fff; background-color: #2563eb; }
        .sidebar .nav-link i { font-size: 16px; }
        .topbar { background-color: #ffffff; border-bottom: 1px solid #e2e8f0; height: 65px; display: flex; align-items: center; justify-content: space-between; padding: 0 25px; }
        .content-area { flex: 1; padding: 25px; min-height: calc(100vh - 65px); }
        .card-custom { border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); background: #fff; }
        .badge-status { padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; }
    </style>
</head>
<body>
<div class="d-flex">
    <!-- Sidebar -->
    <aside class="sidebar p-3 d-flex flex-column shrink-0">
        <div class="d-flex align-items-center gap-2 mb-4 px-2">
            <div class="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-center fw-bold" style="width: 36px; height: 36px;">J</div>
            <div>
                <div class="fw-bold text-white fs-6">جی سرویس (JSERVICE)</div>
                <div class="text-secondary" style="font-size: 10px;">مدیریت خدمات پس از فروش</div>
            </div>
        </div>

        <nav class="nav flex-column mb-auto">
            <a href="/dashboard" class="nav-link <?= ($_SERVER['REQUEST_URI'] ?? '') === '/dashboard' ? 'active' : '' ?>">
                <i class="bi bi-speedometer2"></i> داشبورد لایو
            </a>
            <a href="/receptions/create" class="nav-link text-warning fw-bold">
                <i class="bi bi-plus-circle"></i> + پذیرش جدید کالا
            </a>
            <a href="/receptions" class="nav-link <?= str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/receptions') ? 'active' : '' ?>">
                <i class="bi bi-inboxes"></i> مدیریت پذیرش‌ها
            </a>
            <a href="/jobs" class="nav-link <?= str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/jobs') ? 'active' : '' ?>">
                <i class="bi bi-tools"></i> جاب‌ها و گردش کار
            </a>
            <a href="/onsite" class="nav-link <?= str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/onsite') ? 'active' : '' ?>">
                <i class="bi bi-truck"></i> اعزام و سرویس در محل
            </a>
            <a href="/scrap" class="nav-link <?= str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/scrap') ? 'active' : '' ?>">
                <i class="bi bi-trash"></i> انبار داغی و قطعات امانی
            </a>
            <a href="/warranty/inquiry" class="nav-link" target="_blank">
                <i class="bi bi-shield-check"></i> استعلام عمومی گارانتی
            </a>
            <a href="/customers" class="nav-link <?= str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/customers') ? 'active' : '' ?>">
                <i class="bi bi-people"></i> مشتریان (CRM ۳۶۰)
            </a>
        </nav>

        <div class="pt-3 border-top border-secondary border-opacity-25 mt-auto">
            <div class="d-flex align-items-center justify-content-between text-secondary" style="font-size: 11px;">
                <span>لایسنس فعال: نسخه ۱.۰.۰</span>
                <span class="badge bg-success">سازمانی</span>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-grow-1 d-flex flex-column">
        <!-- Topbar -->
        <header class="topbar">
            <div class="d-flex align-items-center gap-3">
                <span class="fw-bold fs-6 text-dark"><?= htmlspecialchars($pageTitle ?? 'پنل مدیریت یکپارچه') ?></span>
            </div>

            <div class="d-flex align-items-center gap-3">
                <span class="text-secondary small">کاربر جاری: <strong class="text-dark"><?= htmlspecialchars(\App\Core\Auth::user()->name ?? 'کاربر') ?></strong></span>
                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                    <?= htmlspecialchars(\App\Core\Auth::user()->getRoleTitle() ?? 'نقش') ?>
                </span>
                <a href="/logout" class="btn btn-outline-danger btn-sm rounded-pill px-3">
                    <i class="bi bi-box-arrow-right"></i> خروج
                </a>
            </div>
        </header>

        <!-- Flash messages -->
        <?php if ($msg = \App\Core\Session::getFlash('success')): ?>
            <div class="alert alert-success mx-4 mt-3 mb-0 rounded-3 border-0 shadow-sm">
                <i class="bi bi-check-circle-fill me-2"></i> <?= htmlspecialchars($msg) ?>
            </div>
        <?php endif; ?>
        <?php if ($err = \App\Core\Session::getFlash('error')): ?>
            <div class="alert alert-danger mx-4 mt-3 mb-0 rounded-3 border-0 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> <?= htmlspecialchars($err) ?>
            </div>
        <?php endif; ?>

        <main class="content-area">
