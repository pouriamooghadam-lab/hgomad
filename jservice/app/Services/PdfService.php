<?php
declare(strict_types=1);

namespace App\Services;

class PdfService
{
    /**
     * Generate HTML printable or stream PDF
     */
    public static function renderReceiptHtml(array $receptionData): string
    {
        $trackingCode = htmlspecialchars($receptionData['tracking_code'] ?? 'N/A');
        $customerName = htmlspecialchars($receptionData['customer_name'] ?? 'مشتری');
        $mobile = htmlspecialchars($receptionData['customer_mobile'] ?? 'N/A');
        $product = htmlspecialchars($receptionData['product_name'] ?? 'کالا');
        $serial = htmlspecialchars($receptionData['serial_number'] ?? 'N/A');
        $issue = htmlspecialchars($receptionData['reported_issues'] ?? 'بررسی فنی');
        $date = htmlspecialchars($receptionData['reception_date'] ?? date('Y-m-d H:i'));
        $estimatedCost = number_format((float)($receptionData['estimated_cost'] ?? 0));
        $terms = '۱. ارائه این رسید هنگام تحویل دستگاه الزامی است.\n۲. مهلت ترخیص کالا حداکثر ۳۰ روز پس از اعلام نتیجه است.';

        return <<<HTML
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>رسید پذیرش کالا - {$trackingCode}</title>
    <style>
        body { font-family: Tahoma, 'Vazirmatn', sans-serif; font-size: 12px; margin: 0; padding: 20px; direction: rtl; }
        .receipt-box { border: 2px solid #000; padding: 15px; border-radius: 8px; max-width: 650px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .title { font-size: 16px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .item { padding: 6px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; }
        .terms { font-size: 10px; border-top: 1px dashed #666; padding-top: 10px; margin-top: 15px; color: #555; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px; font-weight: bold; }
        @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="receipt-box">
        <div class="header">
            <div>
                <div class="title">سامانه خدمات پس از فروش JSERVICE</div>
                <div>برگه پذیرش دستگاه و خدمات فنی</div>
            </div>
            <div style="text-align: left;">
                <div>کد رهگیری: <strong>{$trackingCode}</strong></div>
                <div>تاریخ: {$date}</div>
            </div>
        </div>

        <div class="grid">
            <div class="item"><strong>نام مشتری:</strong> {$customerName}</div>
            <div class="item"><strong>تلفن همراه:</strong> {$mobile}</div>
            <div class="item"><strong>نام کالا / مدل:</strong> {$product}</div>
            <div class="item"><strong>شماره سریال:</strong> {$serial}</div>
            <div class="item" style="grid-column: span 2;"><strong>ایراد اظهار شده:</strong> {$issue}</div>
            <div class="item" style="grid-column: span 2;"><strong>برآورد هزینه اولیه:</strong> {$estimatedCost} ریال</div>
        </div>

        <div class="terms">
            <strong>شرایط و ضوابط پذیرش:</strong><br>
            {$terms}
        </div>

        <div class="signatures">
            <div>امضای مشتری</div>
            <div>مهر و امضای پذیرش</div>
        </div>
    </div>
    <div style="text-align: center; margin-top: 20px;" class="no-print">
        <button onclick="window.print()" style="padding: 10px 25px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">چاپ رسید</button>
    </div>
</body>
</html>
HTML;
    }
}
