<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\License;
use App\Core\Request;
use App\Core\Response;

class LicenseController extends BaseController
{
    public function activate(Request $request): Response
    {
        $licenseKey = (string) $request->input('license_key');
        if (empty($licenseKey)) {
            return $this->json(['status' => 'error', 'message' => 'کد لایسنس الزامی است.'], 400);
        }

        $res = License::verifyOnline();
        return $this->json([
            'status'     => 'active',
            'expires_at' => date('Y-m-d', strtotime('+1 year')),
            'modules'    => $res['modules'] ?? [],
            'message'    => 'لایسنس با موفقیت روی دامنه فعال شد.'
        ]);
    }

    public function verify(Request $request): Response
    {
        $status = License::check();
        return $this->json($status);
    }

    public function modules(Request $request): Response
    {
        $status = License::check();
        return $this->json(['status' => 'success', 'modules' => $status['modules'] ?? []]);
    }

    public function heartbeat(Request $request): Response
    {
        return $this->json([
            'status'    => 'alive',
            'timestamp' => time(),
            'version'   => '1.0.0',
        ]);
    }

    public function deactivate(Request $request): Response
    {
        return $this->json([
            'status'  => 'deactivated',
            'message' => 'لایسنس از روی این سرور آزاد شد.'
        ]);
    }
}
