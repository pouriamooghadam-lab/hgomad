<?php
declare(strict_types=1);

namespace App\Models;

class User extends BaseModel
{
    protected static string $table = 'js_users';
    protected static bool $softDelete = true;

    public function getRoleTitle(): string
    {
        $titles = [
            'super-admin'        => 'مدیر کل سیستم (Super Admin)',
            'admin'              => 'مدیر سیستم',
            'technical-manager'  => 'مدیر فنی و تریاژ',
            'technician'         => 'تکنسین فنی تعمیرات',
            'receptionist'       => 'متصدی پذیرش',
            'warehouse-manager'  => 'انباردار قطعات',
            'finance-manager'    => 'مدیر مالی و حسابدار',
            'crm-expert'         => 'کارشناس امور مشتریان',
            'qc-inspector'       => 'بازرس کنترل کیفی (QC)',
            'replacement-expert' => 'کارشناس تعویض کالا',
            'branch-manager'     => 'مدیر شعبه / نمایندگی',
            'branch-user'        => 'کاربر شعبه',
        ];
        return $titles[$this->role] ?? $this->role_title ?? 'کاربر';
    }
}
