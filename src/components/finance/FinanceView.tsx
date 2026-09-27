import React, { useState } from 'react';
import { Invoice, ServiceTariff, PaymentMethod } from '../../types';
import { Receipt, DollarSign, Plus, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

interface FinanceViewProps {
  invoices: Invoice[];
  tariffs: ServiceTariff[];
  onRecordPayment: (invoiceId: string, amount: number, method: PaymentMethod) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ invoices, tariffs, onRecordPayment }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'tariffs'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pos');

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalPayable, 0);
  const totalWarrantyDiscounts = invoices.reduce((acc, inv) => acc + inv.warrantyDiscountTotal, 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    onRecordPayment(selectedInvoice.id, paymentAmount, paymentMethod);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span>مالی خدمات، فاکتورها، تعرفه‌ها و تسویه‌حساب</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            صدور فاکتور قطعات و اجرت، اعمال تخفیف پوشش گارانتی و تسویه سهم تکنسین‌ها و نمایندگان
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 block mb-1">جمع فاکتورهای خدمات آزاد:</span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalInvoiced.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 block mb-1">هزینه قطعات و اجرت متقبل‌شده گارانتی:</span>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {totalWarrantyDiscounts.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال (رایگان مشتری)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 block mb-1">تعداد فاکتورهای صادر شده:</span>
          <div className="text-xl font-black text-blue-700 font-mono">
            {invoices.length} <span className="text-xs font-normal">عدد</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'invoices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          فهرست فاکتورها و دریافت وجه ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('tariffs')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'tariffs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          کاتالوگ تعرفه اجرت خدمات ({tariffs.length})
        </button>
      </div>

      {activeTab === 'invoices' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5">شماره فاکتور</th>
                <th className="p-3.5">کد جاب</th>
                <th className="p-3.5">مشتری</th>
                <th className="p-3.5">مجموع ناخالص</th>
                <th className="p-3.5">تخفیف گارانتی</th>
                <th className="p-3.5">مبلغ قابل پرداخت مشتری</th>
                <th className="p-3.5">وضعیت پرداخت</th>
                <th className="p-3.5 text-center">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-3.5 font-mono font-bold text-blue-700">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-mono text-slate-700">{inv.trackingCode}</td>
                  <td className="p-3.5 font-bold text-slate-900">{inv.customerName}</td>
                  <td className="p-3.5 font-mono">{inv.subtotal.toLocaleString('fa-IR')} ریال</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">
                    {inv.warrantyDiscountTotal > 0 ? `-${inv.warrantyDiscountTotal.toLocaleString('fa-IR')} ریال` : '۰'}
                  </td>
                  <td className="p-3.5 font-mono font-black text-slate-900">
                    {inv.totalPayable.toLocaleString('fa-IR')} ریال
                  </td>
                  <td className="p-3.5">
                    {inv.status === 'paid' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        تسویه شده ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        در انتظار پرداخت
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {inv.status !== 'paid' && inv.totalPayable > 0 && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentAmount(inv.totalPayable);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs transition cursor-pointer"
                      >
                        ثبت پرداخت
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5">کد تعرفه</th>
                <th className="p-3.5">عنوان خدمت و تعمیر</th>
                <th className="p-3.5">دسته‌بندی</th>
                <th className="p-3.5">نرخ پایه اجرت</th>
                <th className="p-3.5">پوشش در گارانتی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tariffs.map((t) => (
                <tr key={t.id}>
                  <td className="p-3.5 font-mono font-bold text-blue-700">{t.code}</td>
                  <td className="p-3.5 font-bold text-slate-900">{t.title}</td>
                  <td className="p-3.5 text-slate-600">{t.category}</td>
                  <td className="p-3.5 font-mono font-bold">{t.basePrice.toLocaleString('fa-IR')} ریال</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {t.warrantyDiscountPct}٪ رایگان
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">ثبت پرداخت فاکتور {selectedInvoice.invoiceNumber}</h3>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">مبلغ پرداختی (ریال):</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">روش پرداخت:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="pos">کارتخوان دستگاه (POS)</option>
                  <option value="cash">نقدی</option>
                  <option value="card">کارت به کارت</option>
                  <option value="online">درگاه آنلاین پرتال</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 font-bold"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg text-white bg-emerald-600 font-bold">
                  تایید دریافت و صدور مجوز ترخیص
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
