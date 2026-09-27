import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Plus,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  FileText,
  Printer,
  Navigation,
} from 'lucide-react';
import { OnsiteDispatch, OnsiteDispatchStatus, OnsiteTimeSlot, OnsiteZone } from '../../types';
import { StorageService } from '../../services/storageService';

export const OnsiteDispatchView: React.FC = () => {
  const [dispatches, setDispatches] = useState<OnsiteDispatch[]>(StorageService.getOnsiteDispatches());
  const [technicians] = useState(StorageService.getTechnicians());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New dispatch form state
  const [formData, setFormData] = useState<{
    customerName: string;
    customerMobile: string;
    trackingCode: string;
    address: string;
    province: string;
    city: string;
    district: string;
    scheduledDate: string;
    timeSlot: OnsiteTimeSlot;
    technicianId: string;
    zone: OnsiteZone;
    travelCost: number;
    notes: string;
  }>({
    customerName: '',
    customerMobile: '',
    trackingCode: 'JS-1403-' + Math.floor(1000 + Math.random() * 9000),
    address: '',
    province: 'تهران',
    city: 'تهران',
    district: '',
    scheduledDate: '1403/07/10',
    timeSlot: 'morning',
    technicianId: technicians[0]?.id || '',
    zone: 'inside_city',
    travelCost: 350000,
    notes: '',
  });

  const handleZoneChange = (zone: OnsiteZone) => {
    let cost = 350000;
    if (zone === 'suburbs') cost = 600000;
    if (zone === 'intercity') cost = 1200000;
    setFormData((prev) => ({ ...prev, zone, travelCost: cost }));
  };

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerMobile || !formData.address) {
      alert('لطفاً مشخصات مشتری و آدرس محل مراجعه را کامل نمایید.');
      return;
    }
    const tech = technicians.find((t) => t.id === formData.technicianId);
    const newDispatch: OnsiteDispatch = {
      id: 'onsite-' + Date.now(),
      trackingCode: formData.trackingCode,
      jobId: 'job-' + Date.now(),
      customerName: formData.customerName,
      customerMobile: formData.customerMobile,
      address: formData.address,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      scheduledDate: formData.scheduledDate,
      timeSlot: formData.timeSlot,
      technicianId: formData.technicianId,
      technicianName: tech ? tech.name : 'تکنسین اعزامی',
      travelCost: formData.travelCost,
      zone: formData.zone,
      status: 'scheduled',
      notes: formData.notes,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    const updated = [newDispatch, ...dispatches];
    setDispatches(updated);
    StorageService.saveOnsiteDispatches(updated);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: OnsiteDispatchStatus) => {
    const updated = dispatches.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
    setDispatches(updated);
    StorageService.saveOnsiteDispatches(updated);
  };

  const filtered = dispatches.filter((d) => {
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchSearch =
      d.customerName.includes(searchQuery) ||
      d.customerMobile.includes(searchQuery) ||
      d.trackingCode.includes(searchQuery) ||
      d.technicianName.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold border border-blue-400/30">
                ماژول سرویس در محل و اعزام تکنسین (استاندارد نرم‌افزار سروشان و امکا)
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">مدیریت اعزام، تعمیرات در محل و ایاب ذهاب</h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              زمان‌بندی نوبت‌های مراجعه حضوری به منزل/محل کار مشتری، محاسبه تعرفه ایاب‌ذهاب بر اساس زون شهری، تخصیص تکنسین سیار و گزارش تکمیل کار در محل.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ ثبت نوبت اعزام جدید</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">کل ماموریت‌های اعزامی</div>
          <div className="text-2xl font-bold text-slate-900">{dispatches.length} ماموریت</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">امروز: ۲ نوبت فعال</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">در مسیر مراجعه (En Route)</div>
          <div className="text-2xl font-bold text-amber-600">
            {dispatches.filter((d) => d.status === 'technician_en_route').length} تکنسین
          </div>
          <div className="text-[10px] text-slate-500 mt-1">تجهیزات و قطعات در خودرو</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">تکمیل و رفع عیب در محل</div>
          <div className="text-2xl font-bold text-emerald-600">
            {dispatches.filter((d) => d.status === 'completed').length} پرونده
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">نرخ موفقیت تعمیر در محل: ۹۴٪</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">مجموع درآمد ایاب ذهاب</div>
          <div className="text-2xl font-bold text-indigo-600">
            {dispatches.reduce((acc, d) => acc + d.travelCost, 0).toLocaleString()} ت
          </div>
          <div className="text-[10px] text-slate-500 mt-1">تعرفه مصوب اتحادیه</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی نام مشتری، موبایل، کد رهگیری یا نام سرویس‌کار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="scheduled">برنامه‌ریزی شده</option>
            <option value="technician_en_route">در مسیر مراجعه</option>
            <option value="arrived">رسیده به محل مشتری</option>
            <option value="completed">تعمیر کامل در محل</option>
            <option value="canceled">لغو شده</option>
          </select>
        </div>
      </div>

      {/* Dispatches List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.customerName}</span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      {item.trackingCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {item.customerMobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {item.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.timeSlot === 'morning' ? 'صبح (۹ تا ۱۲)' : item.timeSlot === 'afternoon' ? 'عصر (۱۴ تا ۱۸)' : 'غروب (۱۸ تا ۲۱)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    item.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'technician_en_route'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {item.status === 'scheduled' && 'نوبت ثبت شده'}
                  {item.status === 'technician_en_route' && 'در مسیر اعزام'}
                  {item.status === 'arrived' && 'تکنسین در محل'}
                  {item.status === 'completed' && 'اتمام کار و امضای مشتری'}
                  {item.status === 'canceled' && 'لغو ماموریت'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
              <div>
                <span className="text-slate-500 block mb-0.5">آدرس محل استقرار دستگاه:</span>
                <span className="text-slate-800 font-medium flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  {item.address} ({item.district})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">تکنسین سیار مسئول:</span>
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  {item.technicianName}
                </span>
                <span className="text-[10px] text-slate-500">همراه با قطعات و ابزار تست در محل</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">هزینه ایاب‌ذهاب و محدوده:</span>
                <span className="text-emerald-700 font-bold">
                  {item.travelCost.toLocaleString()} تومان ({item.zone === 'inside_city' ? 'داخل محدوده شهری' : 'حومه / خارج محدوده'})
                </span>
                {item.notes && <div className="text-[10px] text-slate-600 mt-1">یادداشت: {item.notes}</div>}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">تغییر وضعیت ماموریت:</span>
                {item.status === 'scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'technician_en_route')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    حرکت تکنسین به محل
                  </button>
                )}
                {item.status === 'technician_en_route' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'arrived')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    اعلام حضور در محل مشتری
                  </button>
                )}
                {item.status === 'arrived' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    ثبت اتمام تعمیرات و امضای تحویل
                  </button>
                )}
              </div>

              <button
                onClick={() => window.print()}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                چاپ برگه ماموریت تکنسین
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New On-Site Dispatch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                ثبت ماموریت و سرویس در محل جدید
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">نام مشتری:</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="مثال: دکتر علیرضا رضایی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">شماره تماس همراه:</label>
                  <input
                    type="text"
                    value={formData.customerMobile}
                    onChange={(e) => setFormData({ ...formData, customerMobile: e.target.value })}
                    placeholder="09121112233"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">آدرس دقیق محل دستگاه:</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="خیابان، پلاک، طبقه، واحد..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">منطقه / محله:</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="مثال: منطقه ۲ - سعادت‌آباد"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">تاریخ مراجعه:</label>
                  <input
                    type="text"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">بازه زمانی:</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as OnsiteTimeSlot })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold"
                  >
                    <option value="morning">صبح (۹ تا ۱۲)</option>
                    <option value="afternoon">عصر (۱۴ تا ۱۸)</option>
                    <option value="evening">غروب (۱۸ تا ۲۱)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">تکنسین اعزامی:</label>
                  <select
                    value={formData.technicianId}
                    onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.skillLevel} - تخصص: {t.specialties.slice(0, 2).join('، ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">محدوده و هزینه ایاب‌ذهاب:</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.zone}
                      onChange={(e) => handleZoneChange(e.target.value as OnsiteZone)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold"
                    >
                      <option value="inside_city">داخل محدوده شهری (۳۵۰,۰۰۰ ت)</option>
                      <option value="suburbs">حومه / اطراف شهر (۶۰۰,۰۰۰ ت)</option>
                      <option value="intercity">بین‌شهری / ویژه (۱,۲۰۰,۰۰۰ ت)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">یادداشت فنی برای تکنسین:</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: دستگاه روشن نمی‌شود - قطعه تغذیه و برد همراه داشته باشید"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  ثبت و صدور ماموریت اعزام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
