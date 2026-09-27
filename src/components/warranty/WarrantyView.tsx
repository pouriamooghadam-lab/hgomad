import React, { useState } from 'react';
import { Serial } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Award,
} from 'lucide-react';
import { WarrantyStatusBadge } from '../common/StatusBadge';

interface WarrantyViewProps {
  serials: Serial[];
}

export const WarrantyView: React.FC<WarrantyViewProps> = ({ serials }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryResult, setInquiryResult] = useState<Serial | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = serials.find(
      (s) =>
        s.serialNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
        (s.imei && s.imei === searchQuery.trim())
    );
    setInquiryResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>مدیریت قوانین گارانتی و استعلام اصالت کالا</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            سیاست‌های گارانتی شرکتی ۱۸ و ۲۴ ماهه، گارانتی قطعه تعویض‌شده ۳ ماهه و گارانتی تعمیر ۱ ماهه
          </p>
        </div>
      </div>

      {/* Instant Warranty Inquiry Tool */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-base font-black mb-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          <span>استعلام سریع اعتبار و سوابق گارانتی دستگاه:</span>
        </h2>
        <form onSubmit={handleInquiry} className="flex flex-col sm:flex-row gap-3 mt-3 max-w-2xl">
          <input
            type="text"
            placeholder="شماره سریال دستگاه یا کد IMEI ۱۵ رقمی را وارد کنید..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
          >
            استعلام آنلاین وضعیت
          </button>
        </form>

        {/* Inquiry Result Display */}
        {hasSearched && (
          <div className="mt-5 p-4 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200">
            {inquiryResult ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">{inquiryResult.brandName} - {inquiryResult.productName}</span>
                  </div>
                  <WarrantyStatusBadge status={inquiryResult.warrantyStatus} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>
                    <span className="text-[11px] text-slate-400 block">شماره سریال:</span>
                    <span className="font-mono font-bold text-blue-700">{inquiryResult.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">شروع گارانتی:</span>
                    <span className="font-mono font-bold">{inquiryResult.warrantyStartDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">اتمام گارانتی:</span>
                    <span className="font-mono font-bold text-slate-900">{inquiryResult.warrantyEndDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">مالک ثبت‌شده:</span>
                    <span className="font-bold text-slate-900">{inquiryResult.customerName || 'موجودی انبار'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-rose-600 font-bold text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>شماره سریال مورد نظر در پایگاه داده شرکت ثبت نشده است یا فاقد گارانتی رسمی می‌باشد.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warranty Policies & Invalidation Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coverage Rules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>خدمات و موارد تحت پوشش گارانتی جی سرویس</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>خرابی‌های ذاتی قطعات الکترونیک و خط تولید کارخانه</li>
            <li>تامین و تعویض رایگان کلیه قطعات یدکی اورجینال معیوب</li>
            <li>عدم دریافت هزینه اجرت کارشناسی، عیب‌یابی و دستمزد تعمیرگاه</li>
            <li>گارانتی ۳ ماهه قطعات تعویض شده از تاریخ تحویل به مشتری</li>
            <li>گارانتی ۱ ماهه اقدامات و اجرت تعمیر انجام شده روی دستگاه</li>
          </ul>
        </div>

        {/* Void Conditions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2 text-rose-700">
            <XCircle className="w-4 h-4" />
            <span>شرایط ابطال رسمی گارانتی (خارج از شمول)</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>صدمات فیزیکی ناشی از سقوط، ضربه‌خوردگی شدید و شکستگی بدنه</li>
            <li>نفوذ مایعات، رطوبت، اکسیداسیون و قرمز شدن سنسور مایع داخلی</li>
            <li>مخدوش شدن یا باز شدن برچسب هولوگرام پلمپ و پیچ‌های گارانتی</li>
            <li>نوسانات ولتاژ برق، استفاده از آداپتورهای غیراستاندارد و کابل نامرغوب</li>
            <li>دستکاری نرم‌افزاری غیرمجاز، روت کردن، آنلاک بوت‌لودر یا بایوس دستکاری‌شده</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
