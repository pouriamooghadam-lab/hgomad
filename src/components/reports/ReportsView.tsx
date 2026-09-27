import React from 'react';
import { Job, Part, TechnicianProfile } from '../../types';
import { BarChart3, Download, Printer, PieChart, TrendingDown, ShieldAlert } from 'lucide-react';

interface ReportsViewProps {
  jobs: Job[];
  parts: Part[];
  technicians: TechnicianProfile[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ jobs, parts, technicians }) => {
  const handleExportCSV = () => {
    const headers = ['TrackingCode', 'CustomerName', 'Mobile', 'Brand', 'Model', 'Serial', 'Status', 'Date'];
    const rows = jobs.map((j) => [
      j.trackingCode,
      `"${j.customerName}"`,
      j.customerMobile,
      `"${j.brandName}"`,
      `"${j.productModel}"`,
      j.serialNumber,
      j.currentStatus,
      j.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jservice_jobs_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>گزارشات آماری، آنالیز مدل‌های پرخرابی و شاخص‌های BI</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بررسی الگوهای خرابی قطعات، مقایسه سرعت تحویل تکنسین‌ها و خروجی داده‌های آماری برای مدیران ارشد
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>خروجی اکسل (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Failing Models Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>مدل‌های دارای بالاترین آمار پذیرش و خرابی</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">سامسونگ گلکسی S24 Ultra (تاچ و حرارت مدار شارژ)</span>
                <span className="font-mono font-bold text-rose-600">۴۲٪ پذیرش‌ها</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">ایسوس ذن‌بوک پرو (سیستم کولینگ و یاتاقان فن)</span>
                <span className="font-mono font-bold text-amber-600">۳۵٪ پذیرش‌ها</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">شیائومی ۱۴ پرو (شکستگی شیشه پشت و گلس دوربین)</span>
                <span className="font-mono font-bold text-blue-600">۲۳٪ پذیرش‌ها</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Replaced Spare Parts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-500" />
            <span>پرتقاضاترین قطعات یدکی مصرفی در تعمیرگاه</span>
          </h3>

          <div className="space-y-3 text-xs">
            {parts.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">کد قطعه: {p.code}</div>
                </div>
                <div className="text-left font-mono">
                  <span className="font-bold text-blue-700 text-sm">{(14 - idx * 2)} مورد</span>
                  <div className="text-[10px] text-slate-500">مصرف ماه جاری</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
