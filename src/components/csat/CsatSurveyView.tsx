import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  User,
  Phone,
  Send,
  Sparkles,
  BarChart3,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { CsatSurvey } from '../../types';
import { StorageService } from '../../services/storageService';

export const CsatSurveyView: React.FC = () => {
  const [surveys, setSurveys] = useState<CsatSurvey[]>(StorageService.getCsatSurveys());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  // Simulation form state
  const [simTracking, setSimTracking] = useState('JS-1403-000103');
  const [simCustomer, setSimCustomer] = useState('مهندس سعید میرزایی');
  const [simMobile, setSimMobile] = useState('09127778899');
  const [simTech, setSimTech] = useState('سهراب رضایی');
  const [simRating, setSimRating] = useState(5);
  const [simFeedback, setSimFeedback] = useState('برخورد پرسنل عالی بود و دستگاه در زمان اعلامی بدون نقص تحویل داده شد.');

  const handleSimulateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: CsatSurvey = {
      id: 'csat-' + Date.now(),
      jobId: 'job-' + Date.now(),
      trackingCode: simTracking,
      customerName: simCustomer,
      customerMobile: simMobile,
      technicianId: 'tp-1',
      technicianName: simTech,
      rating: simRating,
      punctualityScore: simRating,
      behaviorScore: simRating,
      qualityScore: simRating,
      feedback: simFeedback,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    const updated = [newSurvey, ...surveys];
    setSurveys(updated);
    StorageService.saveCsatSurveys(updated);
    setIsSimulateOpen(false);
  };

  const avgRating = surveys.length
    ? (surveys.reduce((acc, s) => acc + s.rating, 0) / surveys.length).toFixed(1)
    : '5.0';

  const filtered = surveys.filter(
    (s) =>
      s.customerName.includes(searchQuery) ||
      s.technicianName.includes(searchQuery) ||
      s.trackingCode.includes(searchQuery) ||
      s.feedback.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                سامانه هوشمند نظرسنجی و رضایت‌سنجی CSAT (مشابه سروشان و امکا)
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">نظرسنجی خودکار پیامکی و پایش رضایت مشتریان</h1>
            <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              ارسال پیامک نظرسنجی بلافاصله پس از تحویل کالا، نمره‌دهی ۱ تا ۵ ستاره بر اساس وقت‌شناسی، اخلاق تکنسین و کیفیت تعمیرات، و محاسبه خودکار پاداش و ضریب پورسانت تکنسین.
            </p>
          </div>
          <button
            onClick={() => setIsSimulateOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>+ شبیه‌سازی ارسال نظر مشتری</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">میانگین رضایت کل (CSAT)</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-slate-900">{avgRating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">از مجموع {surveys.length} نظر ثبت‌شده</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">وقت‌شناسی و سرعت تحویل</div>
          <div className="text-2xl font-bold text-blue-600">۴.۸ / ۵</div>
          <div className="text-[10px] text-slate-500 mt-1">تعهد به زمان تحویل</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">برخورد و رفتار حرفه‌ای</div>
          <div className="text-2xl font-bold text-emerald-600">۴.۹ / ۵</div>
          <div className="text-[10px] text-slate-500 mt-1">امتیاز اخلاق سازمانی</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">کیفیت و دوام تعمیر</div>
          <div className="text-2xl font-bold text-indigo-600">۴.۷ / ۵</div>
          <div className="text-[10px] text-slate-500 mt-1">نرخ بازگشت مجدد: زیر ۲٪</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="جستجوی نام مشتری، تکنسین، متن بازخورد یا شماره پرونده..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  {item.customerName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.customerName}</span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      {item.trackingCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                    <span>تکنسین مسئول: <strong className="text-slate-700">{item.technicianName}</strong></span>
                    <span>•</span>
                    <span className="font-mono">{item.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="font-black text-sm text-amber-800">{item.rating}</span>
                <div className="flex text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
              « {item.feedback} »
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
              <span>وقت‌شناسی: <strong className="text-slate-800">{item.punctualityScore} از ۵</strong></span>
              <span>•</span>
              <span>برخورد پرسنل: <strong className="text-slate-800">{item.behaviorScore} از ۵</strong></span>
              <span>•</span>
              <span>کیفیت کار فنی: <strong className="text-slate-800">{item.qualityScore} از ۵</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Simulate Modal */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                شبیه‌ساز نظرسنجی پیامکی مشتری
              </h3>
              <button onClick={() => setIsSimulateOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSimulateSurvey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">کد رهگیری پرونده:</label>
                <input
                  type="text"
                  value={simTracking}
                  onChange={(e) => setSimTracking(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">نام مشتری:</label>
                  <input
                    type="text"
                    value={simCustomer}
                    onChange={(e) => setSimCustomer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">تکنسین مربوطه:</label>
                  <input
                    type="text"
                    value={simTech}
                    onChange={(e) => setSimTech(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">امتیاز رضایت (۱ تا ۵ ستاره):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setSimRating(star)}
                      className={`flex-1 py-2 rounded-lg font-bold border transition cursor-pointer ${
                        simRating >= star
                          ? 'bg-amber-400 text-slate-950 border-amber-500'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">متن نظر و پیشنهاد مشتری:</label>
                <textarea
                  rows={3}
                  value={simFeedback}
                  onChange={(e) => setSimFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  ثبت بازخورد مشتری
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
