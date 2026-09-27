import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Calendar,
  Store,
  FileText,
  User,
  Phone,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  Printer,
} from 'lucide-react';
import { ConsumerWarrantyActivation } from '../../types';
import { StorageService } from '../../services/storageService';

export const ConsumerWarrantyActivationView: React.FC = () => {
  const [activations, setActivations] = useState<ConsumerWarrantyActivation[]>(
    StorageService.getWarrantyActivations()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Activation Form
  const [form, setForm] = useState({
    serialNumber: '',
    productName: 'Samsung Galaxy S24 Ultra',
    model: 'SM-S928B',
    customerName: '',
    customerMobile: '',
    customerNationalCode: '',
    purchaseDate: '1403/07/01',
    dealerStoreName: 'نمایندگی رسمی سامسونگ چارسو',
    invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
    warrantyMonths: 18,
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serialNumber || !form.customerName || !form.customerMobile) {
      alert('لطفاً شماره سریال دستگاه، نام و شماره موبایل خریدار را وارد نمایید.');
      return;
    }

    const activation: ConsumerWarrantyActivation = {
      id: 'wact-' + Date.now(),
      serialNumber: form.serialNumber,
      productName: form.productName,
      model: form.model,
      customerName: form.customerName,
      customerMobile: form.customerMobile,
      customerNationalCode: form.customerNationalCode || '0012345678',
      purchaseDate: form.purchaseDate,
      dealerStoreName: form.dealerStoreName,
      invoiceNumber: form.invoiceNumber,
      warrantyMonths: form.warrantyMonths,
      warrantyStartDate: form.purchaseDate,
      warrantyEndDate: '1405/01/01',
      status: 'activated',
      activationCode: 'ACT-JS-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    const updated = [activation, ...activations];
    setActivations(updated);
    StorageService.saveWarrantyActivations(updated);
    setIsRegisterOpen(false);
  };

  const filtered = activations.filter(
    (a) =>
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.includes(searchQuery) ||
      a.customerMobile.includes(searchQuery) ||
      a.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-400/30">
                پورتال ثبت و فعال‌سازی آنلاین گارانتی توسط مصرف‌کننده (استاندارد امکا و سامانه جامع گارانتی)
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">سامانه فعال‌سازی گارانتی و استعلام اصالت کالا</h1>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl leading-relaxed">
              خریداران نهایی با اسکن QR کد روی جعبه یا ورود شماره سریال، فاکتور خرید و تاریخ تحویل را ثبت کرده و کارت گارانتی دیجیتال معتبر با کد فعال‌سازی یکتا دریافت می‌نمایند.
            </p>
          </div>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>+ فعال‌سازی آنلاین گارانتی</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="جستجوی سریال دستگاه (IMEI / Serial)، نام خریدار، شماره موبایل یا مدل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Grid of Activated Warranties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {item.serialNumber}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{item.productName}</h3>
                <span className="text-xs text-slate-500">مدل: {item.model}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                گارانتی فعال ({item.warrantyMonths} ماه)
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">نام خریدار:</span>
                <span className="font-bold text-slate-900">{item.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">شماره همراه خریدار:</span>
                <span className="font-mono text-slate-900">{item.customerMobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">فروشگاه صادرکننده فاکتور:</span>
                <span className="text-slate-800">{item.dealerStoreName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تاریخ شروع تا پایان اعتبار:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {item.warrantyStartDate} تا {item.warrantyEndDate}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 font-mono">
                <span className="text-slate-500">کد رهگیری فعال‌سازی:</span>
                <span className="font-bold text-blue-700">{item.activationCode}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-[11px] text-slate-400">ثبت شده در سامانه جامع</span>
              <button
                onClick={() => window.print()}
                className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                چاپ کارت گارانتی دیجیتال
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Activation Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                ثبت و فعال‌سازی کارت گارانتی دستگاه
              </h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">شماره سریال دستگاه (IMEI یا Serial Number):</label>
                <input
                  type="text"
                  value={form.serialNumber}
                  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                  placeholder="SN-SAM-S24U-XXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">نام دستگاه:</label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">مدل دقیق:</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">نام و نام خانوادگی خریدار:</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">شماره موبایل خریدار:</label>
                  <input
                    type="text"
                    value={form.customerMobile}
                    onChange={(e) => setForm({ ...form, customerMobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">نام فروشگاه یا نمایندگی:</label>
                  <input
                    type="text"
                    value={form.dealerStoreName}
                    onChange={(e) => setForm({ ...form, dealerStoreName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">مدت گارانتی (ماه):</label>
                  <select
                    value={form.warrantyMonths}
                    onChange={(e) => setForm({ ...form, warrantyMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold"
                  >
                    <option value={12}>۱۲ ماه</option>
                    <option value={18}>۱۸ ماه (استاندارد)</option>
                    <option value={24}>۲۴ ماه (طلایی)</option>
                    <option value={36}>۳۶ ماه (ویژه)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
                >
                  صدور کارت گارانتی دیجیتال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
