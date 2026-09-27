import React, { useState } from 'react';
import { Job, Serial } from '../../types';
import {
  Search,
  ShieldCheck,
  CheckCircle,
  Clock,
  Wrench,
  PackageCheck,
  ArrowRight,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import { JobStatusBadge, WarrantyStatusBadge } from '../common/StatusBadge';

interface PublicPortalViewProps {
  jobs: Job[];
  serials: Serial[];
  onBackToApp: () => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({ jobs, serials, onBackToApp }) => {
  const [query, setQuery] = useState('');
  const [matchedJob, setMatchedJob] = useState<Job | null>(null);
  const [matchedSerial, setMatchedSerial] = useState<Serial | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    // Search Job
    const foundJob = jobs.find(
      (j) =>
        j.trackingCode.toLowerCase() === clean ||
        j.serialNumber.toLowerCase() === clean ||
        (j.imei && j.imei === clean) ||
        j.customerMobile === clean
    );

    // Search Serial
    const foundSerial = serials.find(
      (s) =>
        s.serialNumber.toLowerCase() === clean ||
        (s.imei && s.imei === clean)
    );

    setMatchedJob(foundJob || null);
    setMatchedSerial(foundSerial || null);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">
            JS
          </div>
          <div>
            <span className="font-black text-lg text-white">پرتال عمومی مشتریان جی سرویس</span>
            <span className="text-xs text-slate-400 block">سامانه سراسری استعلام اصالت گارانتی و پیگیری تعمیرات</span>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition cursor-pointer font-bold"
        >
          <span>ورود به پنل مدیریت پرسنل</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
            استعلام ۲۴ ساعته آنلاین
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">
            پیگیری پرونده تعمیراتی یا استعلام گارانتی کالا
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            کد رهگیری سراسری (مثال: JS-1403-000101)، شماره سریال درج‌شده روی جعبه کالا یا کد IMEI دستگاه را وارد نمایید.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="کد رهگیری (JS-...)، سریال (S/N) یا IMEI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pr-11 pl-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition cursor-pointer shadow-lg shadow-blue-600/30 shrink-0"
          >
            استعلام
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {matchedJob ? (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl space-y-6 text-xs">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-mono">کد رهگیری پرونده سراسری:</span>
                    <span className="text-xl font-mono font-black text-blue-400">{matchedJob.trackingCode}</span>
                  </div>
                  <JobStatusBadge status={matchedJob.currentStatus} size="md" />
                </div>

                {/* Progress Stepper */}
                <div>
                  <span className="text-slate-400 font-bold block mb-3">مراحل پیشرفت فرآیند خدمات:</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-bold">
                      ✓ پذیرش اولیه
                    </div>
                    <div className={`p-2 rounded-lg border font-bold ${['in_repair', 'waiting_for_parts', 'in_qc', 'qc_passed', 'waiting_for_dispatch', 'completed'].includes(matchedJob.currentStatus) ? 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                      کارشناسی و تعمیر
                    </div>
                    <div className={`p-2 rounded-lg border font-bold ${['qc_passed', 'waiting_for_dispatch', 'completed'].includes(matchedJob.currentStatus) ? 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                      تست کنترل کیفی
                    </div>
                    <div className={`p-2 rounded-lg border font-bold ${matchedJob.currentStatus === 'completed' ? 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                      تحویل به مشتری
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">نام کالا و مدل:</span>
                    <span className="font-bold text-white text-sm">{matchedJob.brandName} - {matchedJob.productModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">شماره سریال:</span>
                    <span className="font-mono font-bold text-blue-300">{matchedJob.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">شعبه تحویل‌گیرنده:</span>
                    <span className="text-white font-medium">{matchedJob.branchName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">تاریخ پذیرش:</span>
                    <span className="font-mono text-white">{matchedJob.createdAt}</span>
                  </div>
                </div>

                {/* Complaint */}
                <div className="border border-slate-700 p-3 rounded-xl bg-slate-900/30">
                  <span className="text-slate-400 font-bold block mb-1">ایراد اظهارشده در پذیرش:</span>
                  <p className="text-slate-200 leading-relaxed">{matchedJob.customerComplaint}</p>
                </div>
              </div>
            ) : matchedSerial ? (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <div className="text-base font-bold text-white">{matchedSerial.brandName} {matchedSerial.productName}</div>
                    <div className="font-mono text-blue-400">S/N: {matchedSerial.serialNumber}</div>
                  </div>
                  <WarrantyStatusBadge status={matchedSerial.warrantyStatus} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>شروع گارانتی: <span className="font-mono font-bold text-white">{matchedSerial.warrantyStartDate}</span></div>
                  <div>پایان گارانتی: <span className="font-mono font-bold text-white">{matchedSerial.warrantyEndDate}</span></div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center text-slate-400 text-xs">
                موردی با این شناسه رهگیری یا سریال در پایگاه داده یافت نشد. لطفاً در درج حروف انگلیسی و اعداد دقت فرمایید.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        سامانه جامع خدمات پس از فروش و گارانتی جی سرویس (JSERVICE) | پشتیبانی تلفنی: ۰۲۱-۸۸۹۹۰۰۰۰
      </footer>
    </div>
  );
};
