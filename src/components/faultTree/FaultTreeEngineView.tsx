import React, { useState } from 'react';
import {
  GitFork,
  Search,
  CheckCircle,
  HelpCircle,
  Wrench,
  Cpu,
  Clock,
  Tag,
  AlertOctagon,
  Plus,
  BookOpen,
} from 'lucide-react';
import { FaultTreeGuide } from '../../types';
import { StorageService } from '../../services/storageService';

export const FaultTreeEngineView: React.FC = () => {
  const [guides, setGuides] = useState<FaultTreeGuide[]>(StorageService.getFaultGuides());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<FaultTreeGuide | null>(guides[0] || null);

  const categories = ['all', 'لوازم خانگی - لباسشویی', 'موبایل و تبلت', 'لپ‌تاپ و تبلت'];

  const filteredGuides = guides.filter((g) => {
    const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchSearch =
      g.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.symptom.includes(searchQuery) ||
      g.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/30">
              درخت عیب‌یابی هوشمند و راهنمای خطای فنی (استاندارد نرم‌افزار سون‌پرو و سروشان)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">درخت تصمیم‌گیری عیب‌یابی و بانک کدهای خطای تخصصی</h1>
          <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
            راهنمای گام‌به‌گام تکنسین‌ها برای عیب‌یابی سریع، تست مولتی‌متر و اوسیلوسکوپ، علت‌یابی ریشه‌ای و پیشنهاد قطعه یدکی متناسب با زمان استاندارد تعمیرات.
          </p>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'all' ? 'همه دسته‌بندی‌ها' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی کد خطا (مثال: E18 یا THERMAL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Grid: Guide List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Col 1: List of Guides */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-600 px-1">کدهای خطا و نشانه‌های ثبت‌شده ({filteredGuides.length}):</div>
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setActiveGuide(guide)}
              className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-2 ${
                activeGuide?.id === guide.id
                  ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-black text-sm text-slate-900 bg-black/5 px-2 py-0.5 rounded">
                  {guide.errorCode}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {guide.brand} • {guide.model}
                </span>
              </div>
              <p className="text-slate-700 font-semibold line-clamp-2 leading-relaxed">
                {guide.symptom}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" /> {guide.estimatedRepairTimeMin} دقیقه استاندارد
                </span>
                <span className="text-amber-800 font-bold">مشاهده مراحل تست ←</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right/Col 2 & 3: Detailed Step-by-Step Decision Tree */}
        {activeGuide && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg">
                    کد خطا: {activeGuide.errorCode}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {activeGuide.category}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  دستگاه هدف: <strong className="text-slate-800">{activeGuide.brand} {activeGuide.model}</strong>
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-2">{activeGuide.symptom}</h2>
            </div>

            {/* Step-by-step Test Procedure */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-blue-600" />
                مراحل تست و گام‌های عیب‌یابی تکنسین (Decision Tree Steps):
              </h3>
              <div className="space-y-2">
                {activeGuide.stepByStepTest.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Possible Root Causes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                علل ریشه‌ای احتمالی (Root Causes):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {activeGuide.possibleCauses.map((cause, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-950 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Part & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs space-y-1">
                <span className="text-emerald-800 font-bold block flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-600" /> قطعه یدکی پیشنهادی جهت رفع عیب:
                </span>
                <span className="text-slate-900 font-black text-sm block mt-1">{activeGuide.recommendedPart}</span>
                <span className="text-[11px] text-emerald-700">موجودی در انبار مرکزی قابل سفارش است.</span>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> زمان استاندارد رفع عیب:
                </span>
                <span className="text-2xl font-black block mt-1">{activeGuide.estimatedRepairTimeMin} دقیقه</span>
                <span className="text-[11px] text-slate-400">مبنای محاسبه دستمزد و کارکرد فنی تکنسین</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
