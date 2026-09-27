<?php
$pageTitle = 'پذیرش کالا و تریاژ ورود به مرکز';
require_once APP_PATH . '/Views/layouts/header.php';
?>

<div class="card-custom p-4 max-w-4xl mx-auto">
    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
            <h2 class="fs-5 fw-bold text-dark mb-1">فرم پذیرش رسمی دستگاه</h2>
            <p class="text-secondary small mb-0">ثبت اطلاعات مشتری، شماره سریال، بررسی گارانتی و صدور رسید چاپی</p>
        </div>
        <a href="/receptions" class="btn btn-outline-secondary btn-sm rounded-pill px-3">بازگشت به لیست</a>
    </div>

    <form action="/receptions/store" method="POST" class="needs-validation">
        <?= csrf_field() ?>

        <!-- Customer Section -->
        <h3 class="fs-6 fw-bold text-primary mb-3"><i class="bi bi-person-badge me-1"></i> ۱. مشخصات مشتری</h3>
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">نام و نام خانوادگی:</label>
                <input type="text" name="customer_name" class="form-control" placeholder="مثال: دکتر علیرضا رضایی" required>
            </div>
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">شماره تلفن همراه:</label>
                <input type="text" name="customer_mobile" class="form-control font-monospace" placeholder="09121112233" required>
            </div>
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">کد ملی / شناسه ملی:</label>
                <input type="text" name="customer_national" class="form-control font-monospace" placeholder="0012345678">
            </div>
            <div class="col-md-12">
                <label class="form-label small text-secondary fw-semibold">آدرس پستی جهت ارسال احتمالی کالا:</label>
                <input type="text" name="address" class="form-control" placeholder="استان، شهر، خیابان، پلاک، واحد...">
            </div>
        </div>

        <!-- Device & Serial Section -->
        <h3 class="fs-6 fw-bold text-primary mb-3"><i class="bi bi-cpu me-1"></i> ۲. مشخصات دستگاه و گارانتی</h3>
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">شماره سریال دستگاه (Serial Number):</label>
                <input type="text" name="serial_number" class="form-control font-monospace" placeholder="SN-SAM-S24U-9901" required>
            </div>
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">شناسه IMEI (در صورت وجود):</label>
                <input type="text" name="imei" class="form-control font-monospace" placeholder="354890123456789">
            </div>
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">وضعیت گارانتی اعلامی:</label>
                <select name="warranty_condition" class="form-select">
                    <option value="under_warranty">تحت پوشش گارانتی معتبر شرکتی</option>
                    <option value="out_of_warranty">آزاد / فاقد گارانتی</option>
                    <option value="pending_inspection">نیاز به کارشناسی فنی جهت تایید</option>
                </select>
            </div>
        </div>

        <!-- Triage & Faults -->
        <h3 class="fs-6 fw-bold text-primary mb-3"><i class="bi bi-exclamation-diamond me-1"></i> ۳. ایرادات اعلامی و وضعیت ظاهری</h3>
        <div class="row g-3 mb-4">
            <div class="col-md-8">
                <label class="form-label small text-secondary fw-semibold">ایراد اعلام‌شده توسط مشتری:</label>
                <textarea name="customer_complaint" rows="2" class="form-control" placeholder="شرح دقیق علائم خرابی دستگاه..." required></textarea>
            </div>
            <div class="col-md-4">
                <label class="form-label small text-secondary fw-semibold">اولویت رسیدگی:</label>
                <select name="priority" class="form-select">
                    <option value="normal">عادی (روال استاندارد ۳ تا ۵ روز)</option>
                    <option value="high">فوری (حداکثر ۴۸ ساعت)</option>
                    <option value="urgent">اضطراری / VIP (همان روز)</option>
                </select>
            </div>
            <div class="col-md-12">
                <label class="form-label small text-secondary fw-semibold">تشخیص اولیه و یادداشت کارشناس پذیرش:</label>
                <input type="text" name="expert_notes" class="form-control" placeholder="خط و خش بدنه، اقلام همراه مانند کارتن، کابل، شارژر...">
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="reset" class="btn btn-light px-4">پاک کردن فرم</button>
            <button type="submit" class="btn btn-primary px-5 fw-bold">
                <i class="bi bi-check2-circle me-1"></i> ثبت نهایی پذیرش و صدور رسید رهگیری
            </button>
        </div>
    </form>
</div>

<?php require_once APP_PATH . '/Views/layouts/footer.php'; ?>
