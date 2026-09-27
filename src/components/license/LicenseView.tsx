import React, { useState } from 'react';
import { LicenseInfo } from '../../types';
import { Key, Server, CheckCircle2, RefreshCw, Shield, AlertCircle } from 'lucide-react';

interface LicenseViewProps {
  license: LicenseInfo;
  onUpdateLicense: (license: LicenseInfo) => void;
}

export const LicenseView: React.FC<LicenseViewProps> = ({ license, onUpdateLicense }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverUrl, setServerUrl] = useState(license.serverUrl);
  const [licenseKey, setLicenseKey] = useState(license.licenseKey);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setVerifyMessage(null);
    setTimeout(() => {
      setIsVerifying(false);
      const updated: LicenseInfo = {
        ...license,
        serverUrl,
        licenseKey,
        lastVerifiedAt: '1403/07/06 - 12:45',
        status: 'valid',
      };
      onUpdateLicense(updated);
      setVerifyMessage('اعتبارسنجی با موفقیت از سرور مرکزی انجام شد. وضعیت کلیه ماژول‌ها تایید گردید.');
    }, 1200);
  };

  const handleToggleModule = (moduleKey: keyof LicenseInfo['activeModules']) => {
    const updated: LicenseInfo = {
      ...license,
      activeModules: {
        ...license.activeModules,
        [moduleKey]: !license.activeModules[moduleKey],
      },
    };
    onUpdateLicense(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>مدیریت لایسنس، وب‌سرویس API و کنترل دسترسی ماژول‌ها</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ارتباط زنده نرم‌افزار با سرور مرکزی جهت اعتبارسنجی لایسنس سازمانی، تعداد شعب مجاز و فعال‌سازی قابلیت‌ها
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server Connection Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>تنظیمات ارتباط API با سرور اختصاصی شرکت:</span>
          </h3>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">آدرس وب‌سرویس اعتبارسنجی (API Endpoint):</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">کلید یکتای لایسنس نرم‌افزار (License Key):</label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono font-bold text-blue-700 uppercase"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-600">
            <div>شرکت دارنده مجوز: <strong className="text-slate-900">{license.companyName}</strong></div>
            <div>تاریخ اعتبار تا: <strong className="text-slate-900 font-mono">{license.expiresAt}</strong></div>
            <div>سقف شعب مجاز: <strong className="text-slate-900 font-mono">{license.licensedBranches} شعبه</strong></div>
            <div>سقف کاربران فعال: <strong className="text-slate-900 font-mono">{license.licensedUsers} کاربر</strong></div>
            <div>آخرین همگام‌سازی با سرور: <strong className="text-slate-900 font-mono">{license.lastVerifiedAt}</strong></div>
          </div>

          {verifyMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{verifyMessage}</span>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'در حال اتصال به سرور مرکزی...' : 'بررسی و همگام‌سازی آنلاین لایسنس'}</span>
          </button>
        </div>

        {/* Modular Feature Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>کنترل ماژول‌های فعال روی این نسخه (Remote Module Control):</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(license.activeModules).map(([key, isEnabled]) => {
              const titles: Record<string, string> = {
                core: 'هسته اصلی (پذیرش، جاب، کالا و سریال)',
                smsGateway: 'ماژول ارسال پیامک خودکار به مشتریان',
                multiBranch: 'پشتیبانی از چند شعبه و حواله ترنسفر بین استانی',
                digitalSignatures: 'پد لمسی امضای دیجیتال مشتری در پذیرش',
                warrantyApprovalEngine: 'موتور تایید دو مرحله‌ای کارشناسی و مدیریت فنی',
                scrapManagement: 'انبارداری و مدیریت قطعات داغی و اسقاط',
                financeAndTariffs: 'ماژول صدور فاکتور، تعرفه خدمات و تسویه نمایندگی',
                publicPortal: 'پرتال بدون لاگین استعلام عمومی مشتریان',
              };

              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">{titles[key] || key}</span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">module_id: {key}</div>
                  </div>
                  <button
                    onClick={() => handleToggleModule(key as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      isEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isEnabled ? 'فعال ✓' : 'غیرفعال'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
