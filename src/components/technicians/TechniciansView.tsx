import React from 'react';
import { TechnicianProfile } from '../../types';
import { UserCheck, Award, Clock, DollarSign, Star, CheckCircle } from 'lucide-react';

interface TechniciansViewProps {
  technicians: TechnicianProfile[];
}

export const TechniciansView: React.FC<TechniciansViewProps> = ({ technicians }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>مدیریت تکنسین‌ها، تخصص‌ها و ظرفیت کاری روزانه</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            سنجش عملکرد، درصد پورسانت تعمیرات، نرخ تعمیر موفق و کنترل سقف بار کاری روزانه
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{tech.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                    {tech.skillLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">کد پرسنلی: {tech.personnelCode}</div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{tech.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block mb-1">بار کاری فعال:</span>
                <span className="font-bold text-slate-900 text-sm">{tech.currentActiveJobs} از {tech.dailyCapacity} جاب</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block mb-1">نرخ تعمیر موفق:</span>
                <span className="font-bold text-emerald-700 text-sm">{tech.successRate}٪</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block mb-1">کل تعمیرات موفق:</span>
                <span className="font-bold text-slate-900 text-sm">{tech.completedRepairsCount} دستگاه</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block mb-1">درصد پورسانت اجرت:</span>
                <span className="font-bold text-blue-700 text-sm">{tech.commissionPercentage}٪</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-1 font-bold">تخصص‌های تایید شده:</span>
              <div className="flex flex-wrap gap-1.5">
                {tech.specialties.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-medium border border-blue-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
