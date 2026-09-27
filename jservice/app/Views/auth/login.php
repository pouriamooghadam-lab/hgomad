<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود به سامانه جامع خدمات پس از فروش جی سرویس</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        * { font-family: 'Vazirmatn', Tahoma, sans-serif; }
        body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-card { width: 100%; max-width: 440px; background: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .form-control { border-radius: 12px; padding: 12px 16px; font-size: 14px; }
        .btn-primary { border-radius: 12px; padding: 14px; font-weight: bold; font-size: 15px; }
    </style>
</head>
<body>

<div class="login-card">
    <div class="text-center mb-4">
        <div class="bg-primary text-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3 shadow" style="width: 60px; height: 60px;">
            <i class="bi bi-tools fs-2"></i>
        </div>
        <h1 class="fs-4 fw-bold text-dark mb-1">ورود به سامانه جی سرویس</h1>
        <p class="text-secondary small">مدیریت متمرکز گارانتی، پذیرش کالا و تعمیرات</p>
    </div>

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger rounded-3 small py-2 mb-3">
            <i class="bi bi-exclamation-circle me-1"></i> <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($success)): ?>
        <div class="alert alert-success rounded-3 small py-2 mb-3">
            <i class="bi bi-check-circle me-1"></i> <?= htmlspecialchars($success) ?>
        </div>
    <?php endif; ?>

    <form action="/login" method="POST">
        <?= csrf_field() ?>

        <div class="mb-3">
            <label class="form-label text-secondary small fw-semibold">شماره همراه یا ایمیل سازمانی:</label>
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="bi bi-person"></i></span>
                <input type="text" name="identifier" class="form-control border-start-0" placeholder="09121112233" required autofocus>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label text-secondary small fw-semibold">رمز عبور:</label>
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0 text-secondary"><i class="bi bi-lock"></i></span>
                <input type="password" name="password" class="form-control border-start-0" placeholder="••••••••" required>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4 small">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="remember" id="rememberMe">
                <label class="form-check-label text-secondary" for="rememberMe">مرا به خاطر بسپار</label>
            </div>
            <a href="/warranty/inquiry" target="_blank" class="text-primary text-decoration-none">استعلام گارانتی کالا ←</a>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3">
            ورود به حساب کاربری
        </button>

        <div class="text-center text-secondary small">
            <span>لایسنس رسمی فعال</span> • <span>امنیت داده: Argon2ID/Bcrypt</span>
        </div>
    </form>
</div>

</body>
</html>
