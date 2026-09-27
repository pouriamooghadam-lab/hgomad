import React, { useState } from 'react';
import {
  Job,
  JobStatus,
  Part,
  TechnicianProfile,
  UserRole,
  ServiceTariff,
} from '../../types';
import { FAULT_TREE_DATA } from '../../data/mockData';
import {
  X,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  Clock,
  Boxes,
  Receipt,
  History,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
} from 'lucide-react';
import { JobStatusBadge } from '../common/StatusBadge';

interface JobDetailModalProps {
  job: Job;
  parts: Part[];
  technicians: TechnicianProfile[];
  tariffs: ServiceTariff[];
  currentRole: UserRole;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: JobStatus, note?: string) => void;
  onRequestPart: (jobId: string, partId: string, quantity: number) => void;
  onApproveWarrantyByTech: (jobId: string) => void;
  onApproveWarrantyByManager: (jobId: string, approved: boolean, reason?: string) => void;
  onPrintReceipt: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  parts,
  technicians,
  tariffs,
  currentRole,
  onClose,
  onUpdateStatus,
  onRequestPart,
  onApproveWarrantyByTech,
  onApproveWarrantyByManager,
  onPrintReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'warranty' | 'parts' | 'timeline' | 'invoice'>('diagnosis');

  // Diagnosis state
  const [selectedFault, setSelectedFault] = useState('');
  const [repairActionText, setRepairActionText] = useState('');
  const [actionDuration, setActionDuration] = useState(45);

  // Part request state
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id || '');
  const [partQty, setPartQty] = useState(1);

  // Warranty rejection reason
  const [rejectReason, setRejectReason] = useState('ضربه فیزیکی شدید و شکستگی بدنه');

  const handleAddRepairAction = () => {
    if (!repairActionText.trim()) return;
    onUpdateStatus(
      job.id,
      'in_repair',
      `ثبت اقدام تعمیر: ${repairActionText} (مدت: ${actionDuration} دقیقه) - عیب: ${selectedFault || 'تشخیص عمومی'}`
    );
    setRepairActionText('');
    alert('اقدام تعمیراتی با موفقیت در تاریخچه پرونده ثبت گردید.');
  };

  const handleRequestPartSubmit = () => {
    if (!selectedPartId) return;
    onRequestPart(job.id, selectedPartId, partQty);
    alert('درخواست حواله قطعه به انبار مرکزی ارسال شد و در کارتابل انبار قرار گرفت.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              JS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-blue-400">{job.trackingCode}</span>
                <JobStatusBadge status={job.currentStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-400">
                مشتری: {job.customerName} ({job.customerMobile}) | دستگاه: {job.brandName} {job.productModel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintReceipt(job)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ قبض</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'diagnosis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>تشخیص عیب و اقدامات تعمیر</span>
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'warranty' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تایید ۲ مرحله‌ای گارانتی</span>
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'parts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>تامین قطعه از انبار</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>تایم‌لاین گردش کار ({job.timeline.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: Diagnosis & Repair Actions */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-6">
              {/* Complaints & Initial Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-600 block mb-1">ایراد اعلام‌شده توسط مشتری:</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{job.customerComplaint}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-1">نظر اولیه تریاژ و پذیرش‌گر:</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{job.expertInitialNotes || 'بدون یادداشت اولیه'}</p>
                </div>
              </div>

              {/* Fault Tree Selector (درختواره خرابی) */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>درختواره ریشه‌یابی خرابی (Fault Tree Analysis):</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">انتخاب عیب شایع از کاتالوگ:</label>
                    <select
                      value={selectedFault}
                      onChange={(e) => setSelectedFault(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    >
                      <option value="">انتخاب از درختواره خرابی...</option>
                      {FAULT_TREE_DATA.flatMap((cat) =>
                        cat.children?.flatMap((sub) =>
                          sub.children?.map((leaf) => (
                            <option key={leaf.id} value={`${cat.title} > ${sub.title} > ${leaf.title}`}>
                              {sub.title} - {leaf.title}
                            </option>
                          ))
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">مدت زمان صرف‌شده برای اقدام (دقیقه):</label>
                    <input
                      type="number"
                      value={actionDuration}
                      onChange={(e) => setActionDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-1">شرح اقدام تعمیراتی انجام‌شده:</label>
                    <textarea
                      rows={2}
                      value={repairActionText}
                      onChange={(e) => setRepairActionText(e.target.value)}
                      placeholder="مثال: تعویض کانکتور مدار شارژ، کالیبراسیون پنل آمولد و تست ۴۸ ساعته بنچ‌مارک..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddRepairAction}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت گزارش اقدام تعمیر در پرونده</span>
                </button>
              </div>

              {/* Progress to QC or Finish */}
              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="font-bold text-xs text-slate-900">انتقال پرونده به مرحله بعد:</div>
                  <p className="text-[11px] text-slate-500">پس از اتمام تعمیرات، دستگاه باید جهت تست استانداردهای کیفی به بازرس QC ارجاع شود.</p>
                </div>
                <button
                  onClick={() => onUpdateStatus(job.id, 'in_qc', 'تعمیرات تکمیل شد و دستگاه جهت تست نهایی به کارتابل QC ارسال گردید.')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  ارجاع به کنترل کیفی (QC) ←
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Two-Step Warranty Approval */}
          {activeTab === 'warranty' && (
            <div className="space-y-6 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>موتور تایید دو مرحله‌ای گارانتی (Two-Step Warranty Engine)</span>
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  طبق آیین‌نامه سازمان حمایت، ابتدا تکنسین عیب را کارشناسی کرده و تاییدیه فنی می‌دهد. سپس مدیر فنی مستندات را بررسی و مجوز مصرف قطعه رایگان یا تحویل کالا با پوشش شرکت را صادر می‌نماید.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Technician Verification */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">مرحله ۱: کارشناسی تکنسین</span>
                    {job.isWarrantyApprovedByTech ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">تایید شده ✓</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">در انتظار تایید تکنسین</span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    تکنسین تعمیرگاه صحت سریال و عدم وجود آثار ضربه، آب‌خوردگی یا دستکاری نرم‌افزاری را بررسی و تایید می‌نماید.
                  </p>
                  {!job.isWarrantyApprovedByTech && (
                    <button
                      onClick={() => onApproveWarrantyByTech(job.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition cursor-pointer"
                    >
                      تایید کارشناسی گارانتی توسط تکنسین
                    </button>
                  )}
                </div>

                {/* Step 2: Technical Manager Approval */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">مرحله ۲: تصویب مدیر فنی</span>
                    {job.isWarrantyApprovedByManager ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">تایید رسمی مدیر فنی ✓</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">در انتظار تصمیم مدیر فنی</span>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    مدیر فنی پس از بررسی گزارش و سوابق دستگاه، مجوز خدمات رایگان یا ابطال گارانتی را صادر می‌کند.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveWarrantyByManager(job.id, true)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition cursor-pointer"
                    >
                      تایید نهایی گارانتی رایگان
                    </button>
                    <button
                      onClick={() => onApproveWarrantyByManager(job.id, false, rejectReason)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg transition cursor-pointer"
                    >
                      رد گارانتی (ابطال)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Part Requisitions */}
          {activeTab === 'parts' && (
            <div className="space-y-6 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-xs">ثبت درخواست قطعه یدکی از انبار مرکزی:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-1">انتخاب قطعه از کاتالوگ انبار:</label>
                    <select
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                    >
                      {parts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (کد: {p.code}) - موجودی: {p.currentStock} {p.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">تعداد درخواستی:</label>
                    <input
                      type="number"
                      min={1}
                      value={partQty}
                      onChange={(e) => setPartQty(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestPartSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>ارسال حواله درخواست قطعه به کارتابل انباردار</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900">تاریخچه کامل گردش کار پرونده (Audit Trail):</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:right-3 before:w-0.5 before:bg-slate-200">
                {job.timeline.map((event, idx) => (
                  <div key={event.id} className="relative flex items-start gap-4 pr-7">
                    <div className="absolute right-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{event.description}</p>
                      <div className="mt-1 text-[10px] text-slate-500 flex items-center gap-2">
                        <span>اقدام‌کننده: {event.operatorName}</span>
                        <span>•</span>
                        <span>نقش: {event.userRole}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
