import React, { useState } from 'react';
import { Serial, Product, Brand, Category } from '../../types';
import {
  Cpu,
  Search,
  Plus,
  QrCode,
  ShieldCheck,
  History,
  Tag,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { WarrantyStatusBadge } from '../common/StatusBadge';

interface SerialsViewProps {
  serials: Serial[];
  products: Product[];
  onAddSerial: (serial: Serial) => void;
}

export const SerialsView: React.FC<SerialsViewProps> = ({ serials, products, onAddSerial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSerial, setSelectedSerial] = useState<Serial | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Serial Form State
  const [serialNumber, setSerialNumber] = useState('');
  const [imei, setImei] = useState('');
  const [batchNumber, setBatchNumber] = useState('B-2024-Q3');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [warrantyMonths, setWarrantyMonths] = useState(18);

  const filteredSerials = serials.filter(
    (s) =>
      s.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.imei && s.imei.includes(searchTerm)) ||
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveSerial = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const newSer: Serial = {
      id: `s-${Date.now()}`,
      serialNumber: serialNumber.trim().toUpperCase(),
      imei: imei.trim(),
      batchNumber,
      productId: prod.id,
      productName: prod.name,
      brandName: prod.brandName,
      model: prod.model,
      productionDate: '1403/01/15',
      saleDate: '1403/07/06',
      branchId: 'br-1',
      branchName: 'دفتر مرکزی تهران',
      warrantyType: 'corporate',
      warrantyStatus: 'active',
      warrantyStartDate: '1403/07/06',
      warrantyEndDate: '1405/01/06',
      status: 'in_stock',
      history: [
        {
          id: `sh-${Date.now()}`,
          date: '1403/07/06',
          type: 'creation',
          title: 'ثبت سریال در انبار مرکزی',
          description: `ورود قطعه/دستگاه با بچ ${batchNumber} و شروع گارانتی ۱۸ ماهه شرکتی`,
          operatorName: 'مدیر انبار و سریال',
        },
      ],
    };

    onAddSerial(newSer);
    setIsAdding(false);
    setSelectedSerial(newSer);
    setSerialNumber('');
    setImei('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>مدیریت کالا و موجودیت مستقل سریال‌ها (Serial Lifecycle)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            سریال قلب سیستم است: رهگیری چرخه عمر کالا از تولید و فروش تا فعال‌سازی گارانتی، پذیرش‌ها و تعویض قطعه
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ ثبت سریال جدید کالا</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="استعلام آنی با شماره سریال (S/N)، کد IMEI، نام کالا یا مالک فعلی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Serials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">شماره سریال (S/N)</th>
                <th className="py-3 px-4 font-semibold">کد IMEI / بچ</th>
                <th className="py-3 px-4 font-semibold">کالا و مدل فنی</th>
                <th className="py-3 px-4 font-semibold">مالک فعلی</th>
                <th className="py-3 px-4 font-semibold">وضعیت گارانتی</th>
                <th className="py-3 px-4 font-semibold">انقضای گارانتی</th>
                <th className="py-3 px-4 font-semibold text-center">تاریخچه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSerials.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.serialNumber}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{s.imei || s.batchNumber || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.brandName} - {s.productName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.model}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {s.customerName ? (
                      <div>
                        <div className="font-bold">{s.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.customerMobile}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">موجودی انبار ({s.branchName})</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <WarrantyStatusBadge status={s.warrantyStatus} />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{s.warrantyEndDate || 'نامشخص'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedSerial(s)}
                      className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer"
                    >
                      شناسنامه و تاریخچه
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Serial Detail / Lifecycle Modal */}
      {selectedSerial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-400 font-bold">شناسنامه ۳۶۰ درجه سریال</div>
                <div className="font-mono font-black text-lg">{selectedSerial.serialNumber}</div>
              </div>
              <button onClick={() => setSelectedSerial(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                بستن
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-800">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">کالا: </span>
                  <span className="font-bold">{selectedSerial.productName}</span>
                </div>
                <div>
                  <span className="text-slate-500">برند و مدل: </span>
                  <span className="font-mono font-bold">{selectedSerial.brandName} - {selectedSerial.model}</span>
                </div>
                <div>
                  <span className="text-slate-500">وضعیت گارانتی: </span>
                  <WarrantyStatusBadge status={selectedSerial.warrantyStatus} />
                </div>
                <div>
                  <span className="text-slate-500">تاریخ اعتبار: </span>
                  <span className="font-mono font-bold text-slate-800">{selectedSerial.warrantyStartDate} تا {selectedSerial.warrantyEndDate}</span>
                </div>
              </div>

              {/* Lifecycle Events */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>رویدادهای ثبت‌شده در چرخه عمر این سریال:</span>
                </h4>
                <div className="space-y-3">
                  {selectedSerial.history.map((h) => (
                    <div key={h.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{h.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{h.description}</p>
                      <div className="text-[10px] text-slate-400 mt-1">اپراتور: {h.operatorName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Serial Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4">ثبت شماره سریال جدید در دیتابیس</h3>
            <form onSubmit={handleSaveSerial} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">انتخاب کالا:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">شماره سریال دستگاه (یکتا):</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="مثال: R58N80A921L"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">کد IMEI (اختیاری برای موبایل):</label>
                <input
                  type="text"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="354892019482015"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-blue-600 font-bold"
                >
                  ذخیره سریال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
