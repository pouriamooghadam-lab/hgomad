import React, { useState } from 'react';
import {
  Job,
  JobStatus,
  TechnicianProfile,
  UserRole,
  Branch,
} from '../../types';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  ChevronLeft,
  UserCheck,
  Building2,
  Wrench,
  AlertCircle,
  FileText,
  Send,
} from 'lucide-react';
import { JobStatusBadge, JOB_STATUS_LABELS } from '../common/StatusBadge';

interface JobsViewProps {
  jobs: Job[];
  technicians: TechnicianProfile[];
  currentRole: UserRole;
  branches: Branch[];
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus, note?: string) => void;
  onAssignTechnician: (jobId: string, technicianId: string, technicianName: string) => void;
  onClaimJob: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onPrintReceipt: (job: Job) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  technicians,
  currentRole,
  branches,
  onUpdateJobStatus,
  onAssignTechnician,
  onClaimJob,
  onSelectJob,
  onPrintReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [cartableFilter, setCartableFilter] = useState<string>('all');

  // Filter Jobs based on role cartable & status filter
  const filteredJobs = jobs.filter((job) => {
    // Search match
    const matchesSearch =
      job.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerMobile.includes(searchTerm) ||
      job.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.productModel.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Cartable filters
    if (cartableFilter === 'my_jobs') {
      // Jobs assigned to currently active technician
      return job.assignedTechnicianId === 'tp-1';
    }
    if (cartableFilter === 'waiting_manager') {
      return job.currentStatus === 'waiting_for_tech_manager' || !job.assignedTechnicianId;
    }
    if (cartableFilter === 'waiting_parts') {
      return job.currentStatus === 'waiting_for_parts';
    }
    if (cartableFilter === 'qc_cartable') {
      return ['in_qc', 'qc_failed', 'qc_passed'].includes(job.currentStatus);
    }
    if (cartableFilter === 'crm_cartable') {
      return ['referred_to_crm', 'waiting_for_customer_call', 'waiting_for_cost_approval'].includes(job.currentStatus);
    }

    // Status filter
    if (selectedFilter !== 'all') {
      return job.currentStatus === selectedFilter;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span>مدیریت پرونده‌ها، کارتابل‌ها و موتور گردش کار (Workflow Engine)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            پیگیری پرونده‌ها در ۱۷ وضعیت استاندارد، تخصیص هوشمند به تکنسین، برداشتن جاب (Claim) و تایید مراحل تعمیر
          </p>
        </div>

        {/* Quick Cartable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setCartableFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              cartableFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            همه پرونده‌ها ({jobs.length})
          </button>
          <button
            onClick={() => setCartableFilter('waiting_manager')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              cartableFilter === 'waiting_manager'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            کارتابل مدیر فنی
          </button>
          <button
            onClick={() => setCartableFilter('my_jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              cartableFilter === 'my_jobs'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            کارتابل تکنسین (من)
          </button>
          <button
            onClick={() => setCartableFilter('waiting_parts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              cartableFilter === 'waiting_parts'
                ? 'bg-yellow-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            منتظر قطعه انبار
          </button>
          <button
            onClick={() => setCartableFilter('qc_cartable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              cartableFilter === 'qc_cartable'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            کارتابل کنترل کیفی (QC)
          </button>
        </div>
      </div>

      {/* Search and Status Dropdown Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی کد رهگیری (JS-1403-...), نام مشتری، موبایل یا مدل کالا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
          >
            <option value="all">تمام وضعیت‌های ۱۷ گانه</option>
            {Object.entries(JOB_STATUS_LABELS).map(([statusKey, conf]) => (
              <option key={statusKey} value={statusKey}>
                {conf.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3.5 px-4 font-semibold">کد سراسری و زمان</th>
                <th className="py-3.5 px-4 font-semibold">مشتری و تماس</th>
                <th className="py-3.5 px-4 font-semibold">کالا، مدل و سریال</th>
                <th className="py-3.5 px-4 font-semibold">اولویت / شمول</th>
                <th className="py-3.5 px-4 font-semibold">تکنسین مسئول</th>
                <th className="py-3.5 px-4 font-semibold">وضعیت گردش کار</th>
                <th className="py-3.5 px-4 font-semibold text-center">اقدامات سریع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    پرونده‌ای با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition">
                    {/* Tracking Code */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-blue-700">{job.trackingCode}</div>
                      <div className="text-[10px] text-slate-400">{job.createdAt}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{job.localReceptionNumber}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{job.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{job.customerMobile}</div>
                      <div className="text-[10px] text-slate-400">{job.branchName}</div>
                    </td>

                    {/* Product & Serial */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{job.brandName} - {job.productModel}</div>
                      <div className="text-[11px] text-blue-600 font-mono">S/N: {job.serialNumber}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{job.customerComplaint}</div>
                    </td>

                    {/* Priority & Warranty */}
                    <td className="py-3.5 px-4">
                      <div>
                        {job.priority === 'urgent' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            فوری VIP
                          </span>
                        )}
                        {job.priority === 'high' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            اولویت بالا
                          </span>
                        )}
                        {job.priority === 'normal' && (
                          <span className="px-2 py-0.5 rounded text-[10px] text-slate-600 bg-slate-100">
                            عادی
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className={`text-[10px] font-medium ${job.warrantyCondition === 'under_warranty' ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {job.warrantyCondition === 'under_warranty' ? 'گارانتی رایگان' : 'خارج از گارانتی'}
                        </span>
                      </div>
                    </td>

                    {/* Assigned Technician & Claim Action */}
                    <td className="py-3.5 px-4">
                      {job.assignedTechnicianName ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-slate-800">{job.assignedTechnicianName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onClaimJob(job.id)}
                            className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold px-2 py-1 rounded text-[11px] transition cursor-pointer"
                            title="برداشتن جاب توسط تکنسین (Claim)"
                          >
                            انجام توسط من (Claim)
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Workflow Status with inline Transition Selector */}
                    <td className="py-3.5 px-4">
                      <div className="mb-1.5">
                        <JobStatusBadge status={job.currentStatus} size="sm" />
                      </div>
                      {/* Status Transition Select */}
                      <select
                        value={job.currentStatus}
                        onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobStatus)}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
                      >
                        {Object.entries(JOB_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            تغییر به: {v.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectJob(job)}
                          className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer"
                          title="مشاهده جزئیات کامل پرونده، تشخیص عیب و قطعات"
                        >
                          بررسی پرونده
                        </button>
                        <button
                          onClick={() => onPrintReceipt(job)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="چاپ قبض پذیرش"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
