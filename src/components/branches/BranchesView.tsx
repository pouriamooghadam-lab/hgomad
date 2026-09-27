import React, { useState } from 'react';
import { Branch, InterBranchTransfer } from '../../types';
import { Building2, Truck, Plus, CheckCircle, Clock } from 'lucide-react';

interface BranchesViewProps {
  branches: Branch[];
  transfers: InterBranchTransfer[];
  onAddTransfer: (transfer: InterBranchTransfer) => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({ branches, transfers, onAddTransfer }) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'transfers'>('transfers');
  const [isAddingTransfer, setIsAddingTransfer] = useState(false);

  // New transfer state
  const [trackingCode, setTrackingCode] = useState('JS-1403-000103');
  const [fromBranch, setFromBranch] = useState(branches[1]?.id || 'br-2');
  const [carrier, setCarrier] = useState<'Tipax' | 'Post' | 'Barbari'>('Tipax');
  const [carrierNumber, setCarrierNumber] = useState('');

  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const fromB = branches.find((b) => b.id === fromBranch) || branches[0];
    const newTr: InterBranchTransfer = {
      id: `tr-${Date.now()}`,
      jobId: 'job-transfer',
      trackingCode: trackingCode.trim().toUpperCase(),
      fromBranchId: fromB.id,
      fromBranchName: fromB.name,
      toBranchId: 'br-1',
      toBranchName: 'مرکز خدمات تخصصی تهران (دفتر مرکزی)',
      carrier,
      carrierTrackingNumber: carrierNumber || `TPX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      dispatchDate: '1403/07/06 - 12:00',
      status: 'in_transit',
      notes: 'ارسال جهت بررسی و تعویض قطعه تخصصی با تجهیزات مرکز',
    };
    onAddTransfer(newTr);
    setIsAddingTransfer(false);
    setCarrierNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>شعب، نمایندگی‌ها و حواله‌های ترنسفر سراسری</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            رهگیری ارسال دستگاه‌ها بین شعب استانی و دفتر مرکزی با کد رهگیری پستی و پذیرش ثانویه
          </p>
        </div>

        <button
          onClick={() => setIsAddingTransfer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ صدور حواله ترنسفر بین شعب</span>
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('transfers')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'transfers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          حواله‌های ارسال دستگاه ({transfers.length})
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'branches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          فهرست شعب و نمایندگان ({branches.length})
        </button>
      </div>

      {activeTab === 'transfers' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5">کد رهگیری جاب</th>
                <th className="p-3.5">مبدا ارسال</th>
                <th className="p-3.5">مقصد ترنسفر</th>
                <th className="p-3.5">حمل‌کننده و شماره بارنامه</th>
                <th className="p-3.5">زمان ارسال</th>
                <th className="p-3.5">وضعیت ترنسفر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transfers.map((tr) => (
                <tr key={tr.id}>
                  <td className="p-3.5 font-mono font-bold text-blue-700">{tr.trackingCode}</td>
                  <td className="p-3.5 font-bold text-slate-800">{tr.fromBranchName}</td>
                  <td className="p-3.5 text-slate-700">{tr.toBranchName}</td>
                  <td className="p-3.5">
                    <span className="font-bold">{tr.carrier}: </span>
                    <span className="font-mono text-slate-600">{tr.carrierTrackingNumber}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{tr.dispatchDate}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1 w-max">
                      <Truck className="w-3 h-3" />
                      <span>در حال حمل بین استانی</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                <span className="font-mono text-blue-700 font-bold">{b.code}</span>
              </div>
              <div>مدیر شعبه: <span className="font-bold">{b.managerName}</span></div>
              <div>شهر و استان: <span className="text-slate-600">{b.city} ({b.province})</span></div>
              <div>تلفن تماس: <span className="font-mono">{b.phone}</span></div>
              <div className="pt-2 text-[11px] text-slate-500">سقف پذیرش روزانه: {b.maxDailyIntake} دستگاه</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Transfer Modal */}
      {isAddingTransfer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4">صدور حواله ارسال به مرکز</h3>
            <form onSubmit={handleSaveTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">کد رهگیری پرونده (JS-...):</label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">شعبه مبدا ارسال:</label>
                <select
                  value={fromBranch}
                  onChange={(e) => setFromBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">نوع شرکت پست / باربری:</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="Tipax">تیپاکس (Tipax)</option>
                  <option value="Post">پست پیشتاز</option>
                  <option value="Barbari">باربری</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">کد رهگیری مرسوله / بارنامه:</label>
                <input
                  type="text"
                  value={carrierNumber}
                  onChange={(e) => setCarrierNumber(e.target.value)}
                  placeholder="TPX-982019482"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTransfer(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 font-bold"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg text-white bg-blue-600 font-bold">
                  ثبت حواله
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
