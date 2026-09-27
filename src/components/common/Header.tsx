import React from 'react';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Server,
  RefreshCw,
  UserCheck,
  PlusCircle,
  Bell,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  currentUser?: { name: string; mobile: string; roleTitle: string } | null;
  onRoleChange: (role: UserRole) => void;
  onOpenPublicPortal: () => void;
  onOpenHostInstaller: () => void;
  onOpenNewReception: () => void;
  onGlobalSearch: (query: string) => void;
  onResetData: () => void;
  onLogout: () => void;
  activeJobsCount: number;
}

const ROLES_LIST: { role: UserRole; title: string }[] = [
  { role: 'super-admin', title: '👑 مدیر کل سیستم (Super-Admin)' },
  { role: 'admin', title: '🏢 مدیر سیستم (Admin)' },
  { role: 'technical-manager', title: '🔬 مدیر فنی و تایید گارانتی' },
  { role: 'technician', title: '🛠️ تکنسین تعمیرات' },
  { role: 'receptionist', title: '📝 پذیرش‌گر و تریاژ' },
  { role: 'warehouse-manager', title: '📦 مدیر انبار قطعات' },
  { role: 'finance-manager', title: '💰 مدیر مالی و حسابداری' },
  { role: 'crm-expert', title: '📞 امور مشتریان و CRM' },
  { role: 'qc-inspector', title: '✅ بازرس کنترل کیفیت (QC)' },
  { role: 'branch-manager', title: '🏬 مدیر شعبه و نمایندگی' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onOpenPublicPortal,
  onOpenHostInstaller,
  onOpenNewReception,
  onGlobalSearch,
  onResetData,
  onLogout,
  activeJobsCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900">JSERVICE</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                اتوماسیون سازمانی
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">سامانه جامع خدمات پس از فروش، گارانتی و مدیریت تعمیرات</p>
          </div>
        </div>

        {/* Global Fast Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="استعلام سریع: شماره سریال، IMEI، کد رهگیری (JS-1403...) یا موبایل"
              onChange={(e) => onGlobalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick Reception Button */}
          <button
            onClick={onOpenNewReception}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">پذیرش جدید</span>
          </button>

          {/* Public Customer Tracking */}
          <button
            onClick={onOpenPublicPortal}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer"
            title="پرتال استعلام بدون لاگین برای مشتری"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden lg:inline">پرتال مشتریان</span>
          </button>

          {/* Shared Hosting Installer Package */}
          <button
            onClick={onOpenHostInstaller}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            title="دانلود نصاب خودکار و دیتابیس SQL برای cPanel / DirectAdmin"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">نصاب هاست اشتراکی</span>
          </button>

          {/* Active Role Selector for Testing RBAC */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 hidden xl:inline">نقش:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 pl-1 border-r border-slate-200 pr-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[9px] text-slate-400">{currentUser.roleTitle}</div>
              </div>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="بازنشانی اطلاعات نمونه دمو"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="خروج امن از حساب کاربری"
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};
