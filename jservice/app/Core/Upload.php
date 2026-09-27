<?php
declare(strict_types=1);

namespace App\Core;

class Upload
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf',
    ];

    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Upload an uploaded file securely to a subdirectory in assets/uploads
     *
     * @param array $file $_FILES['input_name']
     * @param string $folder Subfolder e.g. 'receptions', 'signatures', 'avatars', 'products'
     * @return array [success => bool, url => string, path => string, error => ?string]
     */
    public static function process(array $file, string $folder = 'receptions'): array
    {
        if (!isset($file['error']) || is_array($file['error'])) {
            return ['success' => false, 'error' => 'پارامترهای فایل نامعتبر است.'];
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                return ['success' => false, 'error' => 'هیچ فایلی ارسال نشده است.'];
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return ['success' => false, 'error' => 'حجم فایل بیشتر از حد مجاز است.'];
            default:
                return ['success' => false, 'error' => 'خطای ناشناخته در آپلود فایل رخ داده است.'];
        }

        if ($file['size'] > self::MAX_FILE_SIZE) {
            return ['success' => false, 'error' => 'حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.'];
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::ALLOWED_MIME_TYPES)) {
            return ['success' => false, 'error' => 'فرمت فایل مجاز نیست. فقط JPG, PNG, WEBP و PDF پذیرفته می‌شوند.'];
        }

        $ext = self::ALLOWED_MIME_TYPES[$mime];

        // Sanitize subfolder to prevent path traversal
        $folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $folder);
        $targetDir = PUBLIC_PATH . '/assets/uploads/' . $folder;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Generate safe unique filename
        $filename = sprintf('%s_%s.%s', date('Ymd_His'), bin2hex(random_bytes(8)), $ext);
        $targetPath = $targetDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            return ['success' => false, 'error' => 'انتقال فایل به سرور با شکست مواجه شد. دسترسی پوشه uploads را بررسی نمایید.'];
        }

        $publicUrl = '/assets/uploads/' . $folder . '/' . $filename;

        return [
            'success'   => true,
            'filename'  => $filename,
            'url'       => $publicUrl,
            'path'      => $targetPath,
            'mime_type' => $mime,
            'size'      => $file['size'],
            'error'     => null,
        ];
    }
}
