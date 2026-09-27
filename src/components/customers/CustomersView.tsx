import React, { useState } from 'react';
import { Customer, Job, Serial, CustomerVip } from '../../types';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Smartphone,
  MapPin,
  Package,
  Wrench,
  Receipt,
  Star,
  ChevronLeft,
  X,
  CreditCard,
} from 'lucide-react';
import { VipBadge, JobStatusBadge } from '../common/StatusBadge';

interface CustomersViewProps {
  customers: Customer[];
  jobs: Job[];
  serials: Serial[];
  onAddCustomer: (customer: Customer) => void;
  onSelectJob: (job: Job) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  jobs,
  serials,
  onAddCustomer,
  onSelectJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New customer form state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [vipLevel, setVipLevel] = useState<CustomerVip>('normal');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.nationalCode.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert('لطفاً نام و شماره موبایل را وارد فرمایید.');
      return;
    }
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name,
      mobile,
      nationalCode: nationalCode || '0000000000',
      province: 'تهران',
      city,
      address,
      customerType: 'real',
      source: 'walk-in',
      vipLevel,
      balance: 0,
      createdAt: '1403/07/06',
    };
    onAddCustomer(newCust);
    setIsAddingNew(false);
    setSelectedCustomer(newCust);
    setName('');
    setMobile('');
    setNationalCode('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>مدیریت مشتریان و پرونده ۳۶۰ درجه (CRM ۳۶۰°)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مشاهده کامل زنجیره دستگاه‌ها، تاریخچه گارانتی، پذیرش‌ها، فاکتورهای مالی و شاخص رضایت‌مندی
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ ثبت مشتری جدید</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی نام مشتری، شماره موبایل، کد ملی یا شهر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">نام مشتری / شرکت</th>
                <th className="py-3 px-4 font-semibold">موبایل و تلفن</th>
                <th className="py-3 px-4 font-semibold">کد ملی</th>
                <th className="py-3 px-4 font-semibold">شهر و استان</th>
                <th className="py-3 px-4 font-semibold">سطح وفاداری VIP</th>
                <th className="py-3 px-4 font-semibold">تراز مالی</th>
                <th className="py-3 px-4 font-semibold text-center">پرونده ۳۶۰°</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    {c.companyName && <div className="text-[10px] text-slate-400">{c.companyName}</div>}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{c.mobile}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{c.nationalCode}</td>
                  <td className="py-3 px-4 text-slate-600">{c.city} ({c.province})</td>
                  <td className="py-3 px-4">
                    <VipBadge level={c.vipLevel} />
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {c.balance === 0 ? (
                      <span className="text-slate-400 text-xs">تسویه</span>
                    ) : c.balance > 0 ? (
                      <span className="text-emerald-700 font-bold">+{c.balance.toLocaleString('fa-IR')} بستانکار</span>
                    ) : (
                      <span className="text-rose-700 font-bold">{c.balance.toLocaleString('fa-IR')} بدهکار</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer"
                    >
                      مشاهده پرونده ۳۶۰°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360-Degree Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">{selectedCustomer.name}</h3>
                  <VipBadge level={selectedCustomer.vipLevel} />
                </div>
                <p className="text-xs text-slate-400">
                  موبایل: {selectedCustomer.mobile} | کد ملی: {selectedCustomer.nationalCode}
                </p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              {/* Customer Serials / Devices Owned */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>کالاها و سریال‌های تحت مالکیت مشتری:</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">نام کالا و مدل</th>
                        <th className="p-2.5">شماره سریال</th>
                        <th className="p-2.5">وضعیت گارانتی</th>
                        <th className="p-2.5">پایان گارانتی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {serials.filter((s) => s.customerId === selectedCustomer.id).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            سریال ثبت‌شده‌ای برای این مشتری وجود ندارد.
                          </td>
                        </tr>
                      ) : (
                        serials
                          .filter((s) => s.customerId === selectedCustomer.id)
                          .map((s) => (
                            <tr key={s.id}>
                              <td className="p-2.5 font-bold">{s.productName} ({s.model})</td>
                              <td className="p-2.5 font-mono text-blue-700">{s.serialNumber}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.warrantyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {s.warrantyStatus === 'active' ? 'گارانتی فعال' : 'منقضی شده'}
                                </span>
                              </td>
                              <td className="p-2.5 font-mono">{s.warrantyEndDate || 'نامشخص'}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reception & Repair History */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>تاریخچه پذیرش‌ها و خدمات پس از فروش:</span>
                </h4>
                <div className="space-y-2">
                  {jobs.filter((j) => j.customerId === selectedCustomer.id).map((job) => (
                    <div key={job.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-700">{job.trackingCode}</span>
                          <JobStatusBadge status={job.currentStatus} size="sm" />
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">ایراد: {job.customerComplaint}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCustomer(null);
                          onSelectJob(job);
                        }}
                        className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      >
                        مشاهده پرونده
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
