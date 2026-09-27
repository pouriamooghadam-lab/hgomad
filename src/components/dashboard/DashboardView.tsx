import React from 'react';
import {
  Job,
  Customer,
  Part,
  TechnicianProfile,
  PartRequest,
} from '../../types';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Users,
  ShieldCheck,
  ChevronLeft,
  Wrench,
  PackageCheck,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { JobStatusBadge } from '../common/StatusBadge';

interface DashboardViewProps {
  jobs: Job[];
  customers: Customer[];
  parts: Part[];
  technicians: TechnicianProfile[];
  partRequests: PartRequest[];
  onNavigateToJobs: (filterStatus?: string) => void;
  onNavigateToReception: () => void;
  onSelectJob: (job: Job) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  customers,
  parts,
  technicians,
  partRequests,
  onNavigateToJobs,
  onNavigateToReception,
  onSelectJob,
}) => {
  // Calculations
  const todayReceptions = jobs.length;
  const inRepairJobs = jobs.filter((j) => ['assigned_to_tech', 'in_repair', 'waiting_for_parts'].includes(j.currentStatus));
  const urgentJobs = jobs.filter((j) => j.priority === 'urgent');
  const readyForDelivery = jobs.filter((j) => ['qc_passed', 'waiting_for_dispatch'].includes(j.currentStatus));
  const completedJobs = jobs.filter((j) => j.currentStatus === 'completed');
  const pendingWarrantyManager = jobs.filter((j) => j.currentStatus === 'waiting_for_tech_manager' || (j.isWarrantyApprovedByTech && !j.isWarrantyApprovedByManager));

  const totalInventoryValue = parts.reduce((acc, p) => acc + p.buyPrice * p.currentStock, 0);
  const lowStockParts = parts.filter((p) => p.currentStock <= p.minStock);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold border border-blue-400/30">
                مرکز پایش زنده و هوشمند (Live KPI)
              </span>
              <span className="text-xs text-slate-400">به‌روزرسانی در لحظه</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-1">
              داشبورد عملیات خدمات پس از فروش و گارانتی
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              مدیریت زنجیره خدمات از ثبت پذیرش و بررسی شرایط گارانتی تا ترنسفر بین شعب، تامین قطعه از انبار و کنترل کیفی نهایی.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToReception}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>+ پذیرش فوری دستگاه</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToJobs()}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-xs transition flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <span>مشاهده کارتابل جاب‌ها</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (8 metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigateToJobs()}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">پذیرش‌های کل</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{todayReceptions} <span className="text-xs font-normal text-slate-500">دستگاه</span></div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span>+۱۲٪ نسبت به هفته گذشته</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigateToJobs('in_repair')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">در حال تعمیر و بررسی</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{inRepairJobs.length} <span className="text-xs font-normal text-slate-500">جاب فعال</span></div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            تخصیص‌یافته به تکنسین‌ها
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateToJobs('waiting_for_dispatch')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">آماده ترخیص و تحویل</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{readyForDelivery.length} <span className="text-xs font-normal text-slate-500">دستگاه</span></div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            تست QC تایید شده است
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigateToJobs('urgent')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">جاب‌های اولویت فوری</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">{urgentJobs.length} <span className="text-xs font-normal text-slate-500">مورد اضطراری</span></div>
          <div className="mt-2 text-[11px] text-rose-600 font-medium">
            نیاز به تریاژ و تحویل سریع
          </div>
        </div>
      </div>

      {/* Secondary Financial & Inventory Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">ارزش کل موجودی انبار قطعات</span>
            <Boxes className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-slate-900">
            {totalInventoryValue.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">ریال</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {parts.length} ردیف قطعه در ۴ انبار فعال
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">نرخ موفقیت تعمیرات (SLA)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">
            ۹۸.۴٪ <span className="text-xs font-normal text-slate-500">(شاخص کیفی عالی)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            میانگین زمان تحویل: ۲.۴ روز کاری
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">درخواست‌های معوق قطعه</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700">
            {partRequests.filter((r) => r.status === 'pending').length} <span className="text-xs font-normal text-slate-500">حواله در انتظار تایید انبار</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lowStockParts.length} قطعه به حداقل موجودی رسیده‌اند
          </div>
        </div>
      </div>

      {/* Main Grid: Active Workflows & Urgent Action Cartables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Jobs Tracking Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-base text-slate-900">آخرین پرونده‌های فعال در گردش کار</h2>
              <p className="text-xs text-slate-500">جاب‌های در حال اجرا و آخرین وضعیت تخصیص</p>
            </div>
            <button
              onClick={() => onNavigateToJobs()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده همه جاب‌ها</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 pb-2">
                  <th className="pb-3 font-semibold">کد رهگیری</th>
                  <th className="pb-3 font-semibold">مشتری</th>
                  <th className="pb-3 font-semibold">دستگاه و سریال</th>
                  <th className="pb-3 font-semibold">تکنسین</th>
                  <th className="pb-3 font-semibold">وضعیت</th>
                  <th className="pb-3 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3 font-mono font-bold text-blue-700">
                      {job.trackingCode}
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{job.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{job.customerMobile}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{job.brandName} {job.productModel}</div>
                      <div className="text-[10px] text-slate-400 font-mono">S/N: {job.serialNumber}</div>
                    </td>
                    <td className="py-3 text-slate-600">
                      {job.assignedTechnicianName ? (
                        <span className="font-medium text-slate-800">{job.assignedTechnicianName}</span>
                      ) : (
                        <span className="text-amber-600 italic">بدون تکنسین</span>
                      )}
                    </td>
                    <td className="py-3">
                      <JobStatusBadge status={job.currentStatus} size="sm" />
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="text-xs bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 font-medium px-2.5 py-1 rounded-md transition cursor-pointer"
                      >
                        بررسی پرونده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Technicians Capacity & Alerts */}
        <div className="space-y-6">
          {/* Technicians Workload Gauge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">ظرفیت کاری لایو تکنسین‌ها</h3>
            <p className="text-xs text-slate-500 mb-4">میزان بار کاری جاب‌های فعال نسبت به سقف روزانه</p>

            <div className="space-y-4">
              {technicians.map((tech) => {
                const percentage = Math.min(100, Math.round((tech.currentActiveJobs / tech.dailyCapacity) * 100));
                return (
                  <div key={tech.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{tech.name}</span>
                        <span className="text-[10px] text-slate-400 mr-1.5">({tech.skillLevel})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        {tech.currentActiveJobs} از {tech.dailyCapacity} جاب
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage >= 80 ? 'bg-rose-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>تخصص: {tech.specialties[0]}</span>
                      <span className="text-emerald-700 font-bold">رضایت: {tech.rating} ★</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent Action Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>هشدارهای فوری نیازمند اقدام</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {pendingWarrantyManager.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold">{pendingWarrantyManager.length} جاب در انتظار تایید نهایی مدیر فنی</div>
                    <div className="text-[11px] text-amber-700">بررسی ادعای گارانتی و صدور مجوز تامین قطعه رایگان</div>
                  </div>
                </div>
              )}

              {partRequests.some((r) => r.status === 'pending') && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold">درخواست خروج قطعه از انبار مرکزی</div>
                    <div className="text-[11px] text-blue-700">تکنسین‌ها منتظر صدور حواله قطعه یدکی هستند</div>
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold">سامانه پیامک فعال است</div>
                  <div className="text-[11px] text-emerald-700">ارسال خودکار پیامک وضعیت به مشتریان متصل می‌باشد</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
