<?php
$pageTitle = 'داشبورد مدیریتی و پایش زنده';
require_once APP_PATH . '/Views/layouts/header.php';
?>

<!-- KPI Row -->
<div class="row g-4 mb-4">
    <div class="col-md-3">
        <div class="card-custom p-4">
            <div class="text-secondary small mb-1">پذیرش‌های ثبت شده امروز</div>
            <div class="fs-2 fw-bold text-primary"><?= to_persian_num($receptionsToday) ?></div>
            <div class="small text-success mt-2"><i class="bi bi-arrow-up-left"></i> ثبت شده در تمامی شعب</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card-custom p-4">
            <div class="text-secondary small mb-1">دستگاه‌های در حال تعمیر و تست</div>
            <div class="fs-2 fw-bold text-warning"><?= to_persian_num($inRepairCount) ?></div>
            <div class="small text-secondary mt-2"><i class="bi bi-clock-history"></i> کارتابل فعال تکنسین‌ها</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card-custom p-4">
            <div class="text-secondary small mb-1">آماده تحویل / ارسال به مشتری</div>
            <div class="fs-2 fw-bold text-success"><?= to_persian_num($readyDeliveryCount) ?></div>
            <div class="small text-secondary mt-2"><i class="bi bi-check2-all"></i> پیامک ترخیص ارسال شده</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card-custom p-4">
            <div class="text-secondary small mb-1">هشدارهای کسری قطعه انبار</div>
            <div class="fs-2 fw-bold text-danger"><?= to_persian_num($criticalPartsCount) ?></div>
            <div class="small text-danger mt-2"><i class="bi bi-exclamation-octagon"></i> نیاز به سفارش فوری</div>
        </div>
    </div>
</div>

<!-- Recent Jobs Table -->
<div class="card-custom p-4 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fs-6 fw-bold mb-0">آخرین پرونده‌های فعال خدمات و گارانتی</h2>
        <a href="/jobs" class="btn btn-outline-primary btn-sm rounded-pill px-3">مشاهده کل کارتابل ←</a>
    </div>

    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light small text-secondary">
                <tr>
                    <th>کد رهگیری</th>
                    <th>نام مشتری</th>
                    <th>دستگاه / کالا</th>
                    <th>وضعیت جاری گردش کار</th>
                    <th>تاریخ پذیرش</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody class="small">
                <?php if (empty($recentJobs)): ?>
                    <tr><td colspan="6" class="text-center py-4 text-secondary">پرونده‌ای یافت نشد.</td></tr>
                <?php else: ?>
                    <?php foreach ($recentJobs as $job): ?>
                        <tr>
                            <td class="fw-bold font-monospace text-primary"><?= htmlspecialchars($job['tracking_code']) ?></td>
                            <td>
                                <div><?= htmlspecialchars($job['customer_name'] ?? 'مشتری') ?></div>
                                <div class="text-secondary font-monospace" style="font-size: 11px;"><?= htmlspecialchars($job['customer_mobile'] ?? '') ?></div>
                            </td>
                            <td><?= htmlspecialchars($job['product_name'] ?? '-') ?> (<?= htmlspecialchars($job['model'] ?? '-') ?>)</td>
                            <td>
                                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                                    <?= htmlspecialchars($job['current_status']) ?>
                                </span>
                            </td>
                            <td class="text-secondary"><?= htmlspecialchars($job['created_at']) ?></td>
                            <td>
                                <a href="/jobs/<?= $job['id'] ?>" class="btn btn-sm btn-light border px-2 py-1">
                                    <i class="bi bi-eye"></i> پرونده
                                </a>
                                <a href="/receptions/receipt/<?= $job['tracking_code'] ?>" target="_blank" class="btn btn-sm btn-light border px-2 py-1">
                                    <i class="bi bi-printer"></i> رسید
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once APP_PATH . '/Views/layouts/footer.php'; ?>
