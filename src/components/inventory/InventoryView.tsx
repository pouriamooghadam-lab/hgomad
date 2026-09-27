import React, { useState } from 'react';
import {
  Part,
  Warehouse,
  PartRequest,
  ScrapPart,
} from '../../types';
import {
  Boxes,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Barcode,
  Layers,
  Archive,
  RefreshCw,
} from 'lucide-react';

interface InventoryViewProps {
  parts: Part[];
  warehouses: Warehouse[];
  partRequests: PartRequest[];
  scrapParts: ScrapPart[];
  onApprovePartRequest: (requestId: string) => void;
  onRejectPartRequest: (requestId: string, reason: string) => void;
  onAddPart: (part: Part) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  parts,
  warehouses,
  partRequests,
  scrapParts,
  onApprovePartRequest,
  onRejectPartRequest,
  onAddPart,
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'requests' | 'scrap' | 'warehouses'>('parts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPart, setIsAddingPart] = useState(false);

  // New Part Form State
  const [partCode, setPartCode] = useState('');
  const [partName, setPartName] = useState('');
  const [brandName, setBrandName] = useState('سامسونگ');
  const [category, setCategory] = useState('صفحه نمایش و تاچ');
  const [storageBin, setStorageBin] = useState('A1-R01-B01');
  const [buyPrice, setBuyPrice] = useState(1500000);
  const [sellPrice, setSellPrice] = useState(2200000);
  const [stock, setStock] = useState(10);

  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm)
  );

  const handleSavePart = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Part = {
      id: `pt-${Date.now()}`,
      code: partCode.trim().toUpperCase(),
      name: partName.trim(),
      brandName,
      category,
      compatibleModels: ['عمومی'],
      barcode: `880${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      storageBin,
      unit: 'عدد',
      buyPrice,
      sellPrice,
      warrantyCost: buyPrice,
      minStock: 5,
      currentStock: stock,
    };
    onAddPart(newP);
    setIsAddingPart(false);
    setPartCode('');
    setPartName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <span>مدیریت قطعات یدکی و انبارهای چندگانه (Multi-Warehouse ERP)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            انبار مرکزی، انبار مصرفی تعمیرگاه، قطعات داغی (Scrap) و مدیریت حواله‌های صدور قطعه به تکنسین‌ها
          </p>
        </div>

        <button
          onClick={() => setIsAddingPart(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ تعریف قطعه یدکی جدید</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('parts')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'parts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          کاتالوگ و موجودی قطعات ({parts.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>کارتابل درخواست‌های تکنسین</span>
          {partRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="bg-amber-600 text-white px-1.5 py-0.5 rounded-full text-[10px]">
              {partRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('scrap')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'scrap' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          انبار داغی و مستعمل ({scrapParts.length})
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'warehouses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          فهرست انبارها ({warehouses.length})
        </button>
      </div>

      {/* TAB 1: Parts Catalog */}
      {activeTab === 'parts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجوی نام قطعه، کد کالا یا بارکد بین‌المللی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">کد قطعه</th>
                    <th className="py-3 px-4 font-semibold">شرح قطعه یدکی</th>
                    <th className="py-3 px-4 font-semibold">قفسه انبار (Bin)</th>
                    <th className="py-3 px-4 font-semibold">قیمت خرید</th>
                    <th className="py-3 px-4 font-semibold">قیمت فروش آزاد</th>
                    <th className="py-3 px-4 font-semibold">موجودی انبار</th>
                    <th className="py-3 px-4 font-semibold">وضعیت کسری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParts.map((p) => {
                    const isLow = p.currentStock <= p.minStock;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.code}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">بارکد: {p.barcode}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.storageBin}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{p.buyPrice.toLocaleString('fa-IR')} ریال</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.sellPrice.toLocaleString('fa-IR')} ریال</td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900 text-sm">
                          {p.currentStock} {p.unit}
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              نیاز به سفارش خرید
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              کافی ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Part Requests from Technicians */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4">کد رهگیری جاب</th>
                  <th className="py-3 px-4">قطعه درخواستی</th>
                  <th className="py-3 px-4">تعداد</th>
                  <th className="py-3 px-4">تکنسین درخواست‌کننده</th>
                  <th className="py-3 px-4">تاریخ و زمان</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4 text-center">اقدام انباردار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      هیچ درخواست قطعه‌ای در کارتابل انبار وجود ندارد.
                    </td>
                  </tr>
                ) : (
                  partRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{req.trackingCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{req.partName}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{req.quantity} عدد</td>
                      <td className="py-3 px-4 text-slate-700">{req.requestedByTechnicianName}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{req.requestDate}</td>
                      <td className="py-3 px-4">
                        {req.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            در انتظار حواله خروج
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            تحویل داده شد ✓
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => onApprovePartRequest(req.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-xs transition cursor-pointer"
                            >
                              تایید و صدور حواله
                            </button>
                            <button
                              onClick={() => onRejectPartRequest(req.id, 'کسری موجودی انبار')}
                              className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-2 py-1 rounded text-xs transition cursor-pointer"
                            >
                              رد
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">تکمیل شده</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Scrap Parts (انبار داغی) */}
      {activeTab === 'scrap' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            قطعات معیوب و داغی تعویض‌شده در فرآیند تعمیرات ثبت گردیده و تعیین تکلیف (تعمیرپذیر، اسقاط یا بازگشت به سازنده) می‌شوند.
          </div>
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4">شرح قطعه داغی</th>
                <th className="py-3 px-4">شماره پرونده جاب</th>
                <th className="py-3 px-4">تکنسین تحویل‌دهنده</th>
                <th className="py-3 px-4">تاریخ ورود به داغی</th>
                <th className="py-3 px-4">سرنوشت و وضعیت</th>
                <th className="py-3 px-4">توضیحات کارشناسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scrapParts.map((sp) => (
                <tr key={sp.id}>
                  <td className="py-3 px-4 font-bold text-slate-900">{sp.partName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{sp.trackingCode}</td>
                  <td className="py-3 px-4 text-slate-700">{sp.technicianName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{sp.receivedDate}</td>
                  <td className="py-3 px-4">
                    {sp.conditionStatus === 'repairable' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        قابل تعمیر مجدد
                      </span>
                    )}
                    {sp.conditionStatus === 'scrapped' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        اسقاط و بازیافت
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{sp.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Warehouses List */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900">{wh.name}</span>
                <span className="font-mono text-blue-700 font-bold">{wh.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">مسئول انبار:</span>
                <span className="font-bold text-slate-800">{wh.managerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">موقعیت و آدرس:</span>
                <span className="text-slate-700">{wh.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تعداد اقلام قطعه:</span>
                <span className="font-bold text-slate-900 font-mono">{wh.itemsCount.toLocaleString('fa-IR')} عدد</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Part Modal */}
      {isAddingPart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4">تعریف قطعه یدکی جدید</h3>
            <form onSubmit={handleSavePart} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">کد اختصاصی قطعه (Part Code):</label>
                <input
                  type="text"
                  value={partCode}
                  onChange={(e) => setPartCode(e.target.value)}
                  placeholder="مثال: LCD-APL-IP15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">نام کامل قطعه:</label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="مثال: تاچ و ال‌سی‌دی آیفون ۱۵ پرومکس اورجینال"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">قفسه انبار (Bin):</label>
                  <input
                    type="text"
                    value={storageBin}
                    onChange={(e) => setStorageBin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تعداد موجودی اولیه:</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingPart(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 font-bold"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg text-white bg-blue-600 font-bold">
                  ذخیره در انبار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
