<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>رسید رسمی پذیرش خدمات پس از فروش - <?= htmlspecialchars($job['tracking_code']) ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
    <style>
        @page { size: A5 landscape; margin: 8mm; }
        body { font-family: 'Vazirmatn', Tahoma, sans-serif; background: #fff; color: #000; font-size: 11px; margin: 0; padding: 10px; }
        .receipt-card { border: 2px solid #000; border-radius: 8px; padding: 12px; max-width: 780px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
        .title { font-size: 15px; font-weight: 800; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
        .info-cell { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 6px; }
        .barcode-box { font-family: monospace; font-size: 16px; letter-spacing: 4px; font-weight: bold; text-align: center; }
        .terms-box { border: 1px dashed #64748b; padding: 8px; border-radius: 6px; font-size: 9.5px; line-height: 1.6; margin-top: 10px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 25px; padding: 0 40px; text-align: center; }
        .sig-line { border-top: 1px dotted #000; width: 160px; margin-top: 35px; padding-top: 4px; font-weight: bold; }
        @media print { .no-print { display: none !important; } }
    </style>
</head>
<body>

<div class="no-print" style="text-align: center; margin-bottom: 15px;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
        🖨️ چاپ فیزیکی رسید (پرینتر / PDF)
    </button>
    <a href="/dashboard" style="margin-right: 12px; text-decoration: none; color: #64748b; font-size: 12px;">← بازگشت به داشبورد</a>
</div>

<div class="receipt-card">
    <div class="header">
        <div>
            <div class="title">مرکز خدمات پس از فروش و گارانتی جی سرویس (JSERVICE)</div>
            <div style="font-size: 10px; color: #475569; margin-top: 2px;">
                شعبه: <?= htmlspecialchars($job['branch_name'] ?? 'دفتر مرکزی تهران') ?> | تلفن: <?= htmlspecialchars($job['branch_phone'] ?? '۰۲۱-۸۸۸۸۹۹۹۹') ?>
            </div>
        </div>
        <div style="text-align: left;">
            <div class="barcode-box">*<?= htmlspecialchars($job['tracking_code']) ?>*</div>
            <div style="font-size: 10px;">کد رهگیری یکتا: <strong><?= htmlspecialchars($job['tracking_code']) ?></strong></div>
            <div style="font-size: 10px;">تاریخ پذیرش: <?= htmlspecialchars($job['created_at']) ?></div>
        </div>
    </div>

    <div class="grid-2">
        <div class="info-cell"><strong>مشتری محترم:</strong> <?= htmlspecialchars($job['customer_name'] ?? '-') ?></div>
        <div class="info-cell"><strong>شماره تماس همراه:</strong> <?= htmlspecialchars($job['customer_mobile'] ?? '-') ?></div>
        <div class="info-cell"><strong>شماره سریال کالا:</strong> <?= htmlspecialchars($job['serial_number'] ?? '-') ?></div>
        <div class="info-cell"><strong>شناسه IMEI:</strong> <?= htmlspecialchars($job['imei'] ?? '-') ?></div>
        <div class="info-cell"><strong>وضعیت گارانتی:</strong> <?= $job['warranty_condition'] === 'under_warranty' ? 'تحت پوشش گارانتی معتبر' : 'آزاد / فاقد گارانتی' ?></div>
        <div class="info-cell"><strong>کانال پذیرش:</strong> <?= htmlspecialchars($job['channel'] ?? 'حضوری') ?></div>
    </div>

    <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px;">
        <strong>ایراد اظهار شده توسط مشتری:</strong> <?= htmlspecialchars($job['customer_complaint'] ?? 'ذکر نشده') ?>
    </div>

    <?php if (!empty($job['expert_initial_notes'])): ?>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px;">
            <strong>تشخیص اولیه و وضعیت ظاهری:</strong> <?= htmlspecialchars($job['expert_initial_notes']) ?>
        </div>
    <?php endif; ?>

    <div class="terms-box">
        <strong>قوانین و شرایط حقوقی پذیرش دستگاه:</strong><br>
        ۱. تحویل دستگاه به مشتری منحصراً با ارائه اصل این قبض امکان‌پذیر است.<br>
        ۲. شرکت هیچ‌گونه مسئولیتی در قبال حفظ اطلاعات ذخیره شده در حافظه کالا (اطلاعات شخصی، نرم‌افزارها) ندارد.<br>
        ۳. مهلت مراجعه و ترخیص کالا پس از اطلاع‌رسانی پیامکی حداکثر ۳۰ روز می‌باشد و پس از آن مشمول هزینه انبارداری روزانه خواهد شد.<br>
        ۴. استعلام وضعیت زنده دستگاه از طریق سامانه رهگیری آنلاین با کد درج شده در بالای قبض مقدور می‌باشد.
    </div>

    <div class="signatures">
        <div>
            <div>امضاء و تایید متصدی پذیرش:</div>
            <div class="sig-line">کارشناس پذیرش شعبه</div>
        </div>
        <div>
            <div>امضاء و اثر انگشت مشتری:</div>
            <div class="sig-line">صحت مشخصات و ایرادات تایید شد</div>
        </div>
    </div>
</div>

</body>
</html>
