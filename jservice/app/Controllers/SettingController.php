<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Setting;

class SettingController extends BaseController
{
    public function index(Request $request): Response
    {
        $settings = Setting::all();
        return $this->json(['success' => true, 'data' => $settings]);
    }

    public function update(Request $request): Response
    {
        $settings = $request->input('settings', []);
        if (is_array($settings)) {
            foreach ($settings as $key => $val) {
                Setting::set((string)$key, $val);
            }
        }
        return $this->json(['success' => true, 'message' => 'تنظیمات سامانه با موفقیت ذخیره شد.']);
    }
}
