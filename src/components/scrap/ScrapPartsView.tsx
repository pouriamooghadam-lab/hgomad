import React, { useState } from 'react';
import {
  Boxes,
  Trash2,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Search,
  Plus,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { ScrapItem, TechnicianVanInventory } from '../../types';
import { StorageService } from '../../services/storageService';

export const ScrapPartsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scrap' | 'van'>('scrap');
  const [scrapItems, setScrapItems] = useState<ScrapItem[]>(StorageService.getScrapItems());
  const [vanInventory, setVanInventory] = useState<TechnicianVanInventory[]>(StorageService.getVanInventory());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddScrapOpen, setIsAddScrapOpen] = useState(false);

  // New Scrap Item State
  const [newScrap, setNewScrap] = useState({
    trackingCode: 'JS-1403-000101',
    partName: '',
    partCode: '',
    serialOrBarcode: '',
    technicianName: 'سهراب رضایی',
    failureCause: '',
    disposition: 'quarantine' as ScrapItem['disposition'],
  });

  const handleCreateScrap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScrap.partName || !newScrap.serialOrBarcode) {
      alert('لطفاً نام قطعه و بارکد/سریال داغی را وارد کنید.');
      return;
    }
    const item: ScrapItem = {
      id: 'scr-' + Date.now(),
      jobId: 'job-' + Date.now(),
      trackingCode: newScrap.trackingCode,
      partId: 'p-' + Date.now(),
      partName: newScrap.partName,
      partCode: newScrap.partCode || 'PART-GEN-01',
      serialOrBarcode: newScrap.serialOrBarcode,
      technicianId: 'tp-1',
      technicianName: newScrap.technicianName,
      receptionDate: new Date().toLocaleDateString('fa-IR'),
      failureCause: newScrap.failureCause || 'سوختگی قطعه در کاربری عادی',
      disposition: newScrap.disposition,
      isVerifiedByQC: true,
      barcode: 'SCRAP-BAR-' + Math.floor(1000 + Math.random() * 9000),
    };
    const updated = [item, ...scrapItems];
    setScrapItems(updated);
    StorageService.saveScrapItems(updated);
    setIsAddScrapOpen(false);
  };

  const handleUpdateDisposition = (id: string, disp: ScrapItem['disposition']) => {
    const updated = scrapItems.map((item) => (item.id === id ? { ...item, disposition: disp } : item));
    setScrapItems(updated);
    StorageService.saveScrapItems(updated);
  };

  const filteredScrap = scrapItems.filter(
    (s) =>
      s.partName.includes(searchQuery) ||
      s.trackingCode.includes(searchQuery) ||
      s.technicianName.includes(searchQuery) ||
      s.serialOrBarcode.includes(searchQuery)
  );

  const filteredVan = vanInventory.filter(
    (v) => v.partName.includes(searchQuery) || v.technicianName.includes(searchQuery) || v.partCode.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-400/30">
                انبار داغی و انبارک سیار (الزام استاندارد گارانتی سروشان، امکا و سازمان حمایت)
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">مدیریت انبار داغی قطعات اسقاطی و انبارک سیار تکنسین</h1>
            <p className="text-xs text-rose-100 mt-1 max-w-2xl leading-relaxed">
              ثبت و الصاق بارکد یکتا به قطعات مستهلک تعویض‌شده تحت گارانتی (الزامی قبل از بستن فاکتور پرونده)، مانیتورینگ موجودی امانی در خودروی تکنسین‌ها و تعیین تکلیف نهایی (اسقاط، عودت به کارخانه، بازسازی).
            </p>
          </div>
          <button
            onClick={() => setIsAddScrapOpen(true)}
            className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ ثبت و رسید داغی قطعه</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('scrap')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'scrap' ? 'border-rose-600 text-rose-700 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>انبار قطعات داغی و تعویضی ({scrapItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('van')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'van' ? 'border-rose-600 text-rose-700 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>انبارک سیار تکنسین‌ها / قطعات امانی ({vanInventory.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="جستجوی کد رهگیری، نام قطعه، بارکد داغی یا نام تکنسین..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* TAB 1: Scrap Warehouse */}
      {activeTab === 'scrap' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScrap.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.partName}</span>
                      <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">
                        {item.partCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>پرونده: <strong className="text-slate-700 font-mono">{item.trackingCode}</strong></span>
                      <span>•</span>
                      <span>تکنسین تحویل‌دهنده: <strong className="text-slate-700">{item.technicianName}</strong></span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.disposition === 'quarantine' && '🟡 قرنطینه و بررسی فنی'}
                    {item.disposition === 'scrap_heap' && '🔴 اسقاط قطعی و بازیافت'}
                    {item.disposition === 'return_to_manufacturer' && '🔵 عودت به کمپانی سازنده'}
                    {item.disposition === 'refurbish' && '🟢 امکان بازسازی (Refurbish)'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">بارکد الصاقی داغی:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Barcode className="w-3.5 h-3.5 text-slate-600" />
                      {item.barcode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">شناسه سریال قطعه معیوب:</span>
                    <span className="text-rose-600">{item.serialOrBarcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">علت خرابی و تعویض:</span>
                    <span className="text-slate-800 font-sans text-right">{item.failureCause}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-sans">تغییر وضعیت انبار داغی:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleUpdateDisposition(item.id, 'return_to_manufacturer')}
                      className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-bold transition"
                    >
                      عودت به سازنده
                    </button>
                    <button
                      onClick={() => handleUpdateDisposition(item.id, 'scrap_heap')}
                      className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[11px] font-bold transition"
                    >
                      اسقاط دائم
                    </button>
                    <button
                      onClick={() => handleUpdateDisposition(item.id, 'refurbish')}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold transition"
                    >
                      بازسازی
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Van Inventory */}
      {activeTab === 'van' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">لیست قطعات امانی موجود در کیف ابزار / خودروی تکنسین‌ها</span>
            <span className="text-slate-500">کنترل دوره‌ای و مغایرت‌گیری ماهانه</span>
          </div>

          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">نام قطعه یدکی</th>
                <th className="p-3">کد فنی قطعه</th>
                <th className="p-3">تکنسین تحویل‌گیرنده</th>
                <th className="p-3">تعداد در انبارک</th>
                <th className="p-3">تاریخ تحویل امانی</th>
                <th className="p-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{item.partName}</td>
                  <td className="p-3 font-mono text-slate-600">{item.partCode}</td>
                  <td className="p-3 font-semibold text-blue-700">{item.technicianName}</td>
                  <td className="p-3 font-bold text-emerald-600">{item.quantityOnHand} عدد</td>
                  <td className="p-3 font-mono text-slate-500">{item.consignedDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      امانی فعال
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Scrap Modal */}
      {isAddScrapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                ثبت و الصاق بارکد قطعه داغی
              </h3>
              <button onClick={() => setIsAddScrapOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateScrap} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">کد رهگیری پرونده مرتبط:</label>
                <input
                  type="text"
                  value={newScrap.trackingCode}
                  onChange={(e) => setNewScrap({ ...newScrap, trackingCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">نام قطعه تعویض‌شده:</label>
                <input
                  type="text"
                  value={newScrap.partName}
                  onChange={(e) => setNewScrap({ ...newScrap, partName: e.target.value })}
                  placeholder="مثال: تاچ و ال‌سی‌دی اورجینال یا پمپ تخلیه"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">کد فنی قطعه:</label>
                  <input
                    type="text"
                    value={newScrap.partCode}
                    onChange={(e) => setNewScrap({ ...newScrap, partCode: e.target.value })}
                    placeholder="LCD-SAM-S24U"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">سریال یا بارکد قطعه معیوب:</label>
                  <input
                    type="text"
                    value={newScrap.serialOrBarcode}
                    onChange={(e) => setNewScrap({ ...newScrap, serialOrBarcode: e.target.value })}
                    placeholder="DEF-990182"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">علت خرابی / وضعیت عیب:</label>
                <input
                  type="text"
                  value={newScrap.failureCause}
                  onChange={(e) => setNewScrap({ ...newScrap, failureCause: e.target.value })}
                  placeholder="سوختگی در اثر نوسان، شکستگی، پارگی فلت..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddScrapOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  تایید ورود به انبار داغی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
