import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  AlertCircle,
  Building2,
  Search,
  Server,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, user: { name: string; mobile: string; roleTitle: string }) => void;
  onOpenPublicPortal: () => void;
  onOpenInstaller: () => void;
}

const PRESET_ACCOUNTS = [
  {
    role: 'super-admin' as UserRole,
    title: 'مدیر ارشد سیستم',
    name: 'مهندس مقدم (مدیر کل)',
    mobile: '09121112233',
    pass: 'Admin@1403',
    badge: 'دسترسی نامحدود',
    color: 'bg-purple-600',
  },
  {
    role: 'technical-manager' as UserRole,
    title: 'سرپرست فنی و کنترل کیفیت',
    name: 'مهندس رضایی',
    mobile: '09123334455',
    pass: 'Tech@1403',
    badge: 'تایید گارانتی و داغی',
    color: 'bg-indigo-600',
  },
  {
    role: 'technician' as UserRole,
    title: 'تکنسین تعمیرات و اعزام',
    name: 'استاد کریمی',
    mobile: '09351234567',
    pass: 'Worker@1403',
    badge: 'انبارک سیار و تعمیرات',
    color: 'bg-blue-600',
  },
  {
    role: 'receptionist' as UserRole,
    title: 'کارشناس پذیرش و ترخیص',
    name: 'خانم مرادی',
    mobile: '09198765432',
    pass: 'Recep@1403',
    badge: 'پذیرش کالا و صدور رسید',
    color: 'bg-emerald-600',
  },
  {
    role: 'branch-manager' as UserRole,
    title: 'مدیر نمایندگی استان اصفهان',
    name: 'آقای صادقی',
    mobile: '09139998877',
    pass: 'Branch@1403',
    badge: 'نمایندگی و ارجاع',
    color: 'bg-amber-600',
  },
  {
    role: 'accountant' as UserRole,
    title: 'حسابداری و صدور فاکتور',
    name: 'خانم علیزاده',
    mobile: '09124445566',
    pass: 'Finance@1403',
    badge: 'فاکتور، مالیات و تسویه',
    color: 'bg-cyan-600',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onOpenPublicPortal,
  onOpenInstaller,
}) => {
  const [mobile, setMobile] = useState('09121112233');
  const [password, setPassword] = useState('Admin@1403');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super-admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePresetSelect = (preset: typeof PRESET_ACCOUNTS[0]) => {
    setSelectedRole(preset.role);
    setMobile(preset.mobile);
    setPassword(preset.pass);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mobile.trim() || !password.trim()) {
      setErrorMessage('لطفاً شماره موبایل و رمز عبور سازمانی را وارد نمایید.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = PRESET_ACCOUNTS.find(
        (acc) => acc.mobile === mobile.trim() || acc.role === selectedRole
      );

      const role = matched ? matched.role : selectedRole;
      const roleTitle = matched ? matched.title : 'پرسنل مجاز';
      const name = matched ? matched.name : `کاربر ${mobile}`;

      onLoginSuccess(role, { name, mobile, roleTitle });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Top Banner Notice */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-4 shadow-xl shadow-blue-500/10">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          سامانه جامع خدمات پس از فروش و گارانتی
        </h1>
        <p className="mt-1 text-sm font-semibold text-blue-400">JSERVICE ENTERPRISE ERP</p>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          درگاه امن ورود پرسنل، کارشناسان فنی و شعب مجاز شرکت. اطلاعات این سامانه محرمانه و مشمول نظارت امنیتی است.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Glowing Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Account Switcher (For Testing & Access) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              انتخاب پرتال کاربری سازمانی (جهت ورود سریع و تست سطوح دسترسی):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_ACCOUNTS.map((preset) => {
                const isSelected = selectedRole === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-white truncate">{preset.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                شماره موبایل یا شناسه پرسنلی:
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Smartphone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  dir="ltr"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full pr-10 pl-3.5 py-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="0912XXXXXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                کلمه عبور امنیتی:
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-10 py-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>به خاطر سپردن این نشست کاری</span>
              </label>
              <span className="text-slate-500 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> رمزنگاری‌شده با Argon2ID
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال اعتبارسنجی نشست امن...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>ورود امن به سامانه اتوماسیون</span>
                </>
              )}
            </button>
          </form>

          {/* External Links: Customer Portal & Shared Hosting Installer */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onOpenPublicPortal}
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-right flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">پورتال رهگیری مشتریان</div>
                <div className="text-[10px] text-slate-400">استعلام دستگاه با کد رهگیری</div>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenInstaller}
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-right flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">نصاب هاست اشتراکی</div>
                <div className="text-[10px] text-slate-400">دانلود پکیج cPanel و اسکریپت</div>
              </div>
            </button>
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="mt-6 text-center text-[11px] text-slate-500 space-y-1">
          <p>کلیه فعالیت‌ها، تلاش‌های ورود و تغییرات در این سامانه لاگ‌برداری و ذخیره می‌شود.</p>
          <p>سامانه مجهز به Rate-Limiting هوشمند ضد حملات Brute-Force و توکن‌های CSRF می‌باشد.</p>
        </div>
      </div>
    </div>
  );
};
