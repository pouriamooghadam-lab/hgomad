import React from 'react';
import { JobStatus, WarrantyStatus, CustomerVip } from '../../types';

export const JOB_STATUS_LABELS: Record<JobStatus, { label: string; color: string; bg: string }> = {
  registered: { label: 'پذیرش شده', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  in_transit: { label: 'در حال ترنسفر', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  waiting_for_tech_manager: { label: 'ارجاع به مدیر فنی', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  assigned_to_tech: { label: 'تخصیص به تکنسین', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
  waiting_for_customer_call: { label: 'منتظر تماس مشتری', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  referred_to_crm: { label: 'ارجاع به امور مشتریان', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  waiting_for_cost_approval: { label: 'منتظر تایید هزینه', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  cost_approved: { label: 'تایید هزینه شد', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  waiting_for_parts: { label: 'منتظر تامین قطعه', color: 'text-yellow-800', bg: 'bg-yellow-50 border-yellow-200' },
  in_repair: { label: 'در حال تعمیر', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-300' },
  in_qc: { label: 'کنترل کیفی (QC)', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  qc_failed: { label: 'رد کنترل کیفی', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  qc_passed: { label: 'تایید کنترل کیفی', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  waiting_for_replacement: { label: 'در انتظار تعویض کالا', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50 border-fuchsia-200' },
  waiting_for_dispatch: { label: 'منتظر ارسال/تحویل', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  completed: { label: 'تکمیل و تحویل شد', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' },
  canceled: { label: 'لغو شده', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-300' },
};

export const JobStatusBadge: React.FC<{ status: JobStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const conf = JOB_STATUS_LABELS[status] || { label: status, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${conf.bg} ${conf.color} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 opacity-75"></span>
      {conf.label}
    </span>
  );
};

export const WarrantyStatusBadge: React.FC<{ status: WarrantyStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ✓ گارانتی فعال
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          منقضی شده
        </span>
      );
    case 'voided':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          ✕ باطل شده
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          فعال نشده
        </span>
      );
  }
};

export const VipBadge: React.FC<{ level: CustomerVip }> = ({ level }) => {
  switch (level) {
    case 'platinum':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
          ★ پلاتینیوم VIP
        </span>
      );
    case 'gold':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          ★ طلایی VIP
        </span>
      );
    case 'silver':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
          نقره‌ای
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-slate-600 bg-slate-100 border border-slate-200">
          عادی
        </span>
      );
  }
};
