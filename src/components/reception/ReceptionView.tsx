import React, { useState, useRef, useEffect } from 'react';
import {
  Customer,
  Product,
  Serial,
  Job,
  ReceptionChannel,
  ReceptionPriority,
  ReceptionWarrantyCondition,
  VisualCondition,
  Accessories,
  Branch,
} from '../../types';
import {
  Search,
  UserPlus,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Eraser,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ReceptionViewProps {
  customers: Customer[];
  products: Product[];
  serials: Serial[];
  branches: Branch[];
  onSaveJob: (newJob: Job, newCustomer?: Customer, newSerial?: Serial) => void;
  onOpenReceipt: (job: Job) => void;
}

export const ReceptionView: React.FC<ReceptionViewProps> = ({
  customers,
  products,
  serials,
  branches,
  onSaveJob,
  onOpenReceipt,
}) => {
  // Step 1: Customer Info
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustNational, setNewCustNational] = useState('');
  const [newCustCity, setNewCustCity] = useState('تهران');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Step 2: Serial & Product Info
  const [serialSearch, setSerialSearch] = useState('');
  const [selectedSerial, setSelectedSerial] = useState<Serial | null>(null);
  const [isNewSerial, setIsNewSerial] = useState(false);
  const [newSerialNum, setNewSerialNum] = useState('');
  const [newSerialImei, setNewSerialImei] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  // Step 3: Reception Details
  const [channel, setChannel] = useState<ReceptionChannel>('walk-in');
  const [priority, setPriority] = useState<ReceptionPriority>('normal');
  const [branchId, setBranchId] = useState<string>(branches[0]?.id || 'br-1');
  const [customerComplaint, setCustomerComplaint] = useState('');
  const [expertInitialNotes, setExpertInitialNotes] = useState('');
  const [warrantyCondition, setWarrantyCondition] = useState<ReceptionWarrantyCondition>('under_warranty');

  // Visual Condition Checklist
  const [visualCondition, setVisualCondition] = useState<VisualCondition>({
    scratches: false,
    dents: false,
    cracks: false,
    colorFading: false,
    tampered: false,
    waterDamage: false,
    otherNotes: '',
  });

  // Accessories Checklist
  const [accessories, setAccessories] = useState<Accessories>({
    charger: false,
    cable: false,
    battery: true,
    box: true,
    warrantyCard: false,
    purchaseInvoice: false,
    adapter: false,
    otherText: '',
  });

  // Canvas Digital Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Filtered lists
  const filteredCustomers = customerSearch.trim()
    ? customers.filter(
        (c) =>
          c.mobile.includes(customerSearch) ||
          c.name.includes(customerSearch) ||
          c.nationalCode.includes(customerSearch)
      )
    : [];

  const filteredSerials = serialSearch.trim()
    ? serials.filter(
        (s) =>
          s.serialNumber.toLowerCase().includes(serialSearch.toLowerCase()) ||
          (s.imei && s.imei.includes(serialSearch))
      )
    : [];

  // Digital Signature Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Customer
    let cust: Customer;
    let newCustToSave: Customer | undefined;
    if (selectedCustomer) {
      cust = selectedCustomer;
    } else if (isNewCustomer && newCustName && newCustMobile) {
      cust = {
        id: `c-${Date.now()}`,
        name: newCustName,
        mobile: newCustMobile,
        nationalCode: newCustNational || '0000000000',
        province: 'تهران',
        city: newCustCity,
        address: newCustAddress || 'ثبت در محل پذیرش',
        customerType: 'real',
        source: 'walk-in',
        vipLevel: 'normal',
        balance: 0,
        createdAt: '1403/07/06',
      };
      newCustToSave = cust;
    } else {
      alert('لطفاً مشخصات مشتری را انتخاب یا ثبت فرمایید.');
      return;
    }

    // Validate Serial / Product
    let ser: Serial;
    let newSerialToSave: Serial | undefined;
    if (selectedSerial) {
      ser = selectedSerial;
    } else if (isNewSerial && newSerialNum && selectedProduct) {
      ser = {
        id: `s-${Date.now()}`,
        serialNumber: newSerialNum,
        imei: newSerialImei,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        brandName: selectedProduct.brandName,
        model: selectedProduct.model,
        productionDate: '1403/01/01',
        saleDate: '1403/07/06',
        customerId: cust.id,
        customerName: cust.name,
        customerMobile: cust.mobile,
        branchId: branchId,
        branchName: branches.find((b) => b.id === branchId)?.name || 'دفتر مرکزی',
        warrantyType: 'corporate',
        warrantyStatus: 'active',
        warrantyStartDate: '1403/07/06',
        warrantyEndDate: '1405/01/06',
        status: 'in_service',
        history: [
          {
            id: `sh-${Date.now()}`,
            date: '1403/07/06',
            type: 'creation',
            title: 'ثبت سریال در پذیرش',
            description: 'سریال همزمان با پذیرش اولیه در سیستم ثبت گردید',
            operatorName: 'مسئول پذیرش',
          },
        ],
      };
      newSerialToSave = ser;
    } else {
      alert('لطفاً شماره سریال دستگاه را انتخاب یا ثبت فرمایید.');
      return;
    }

    if (!customerComplaint.trim()) {
      alert('لطفاً شرح ایراد اعلامی مشتری را ثبت فرمایید.');
      return;
    }

    // Get Signature data URL
    let signatureUrl: string | undefined = undefined;
    if (canvasRef.current && hasSignature) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    }

    // Generate unique nationwide tracking code e.g. JS-1403-XXXXXX
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `JS-1403-${randomDigits}`;
    const selectedBranch = branches.find((b) => b.id === branchId) || branches[0];
    const localReceptionNumber = `BR-${selectedBranch.code.split('-')[1] || '01'}-1403-${Math.floor(100 + Math.random() * 900)}`;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      trackingCode,
      localReceptionNumber,
      createdAt: '1403/07/06 - 11:30',
      customerId: cust.id,
      customerName: cust.name,
      customerMobile: cust.mobile,
      serialId: ser.id,
      serialNumber: ser.serialNumber,
      imei: ser.imei,
      productName: ser.productName,
      productModel: ser.model,
      brandName: ser.brandName,
      channel,
      priority,
      warrantyCondition,
      customerComplaint,
      expertInitialNotes,
      visualCondition,
      accessories,
      signatureDataUrl: signatureUrl,
      photos: [],
      currentStatus: 'registered',
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      estimatedCost: warrantyCondition === 'under_warranty' ? 0 : 500000,
      finalCost: 0,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: '1403/07/06 - 11:30',
          status: 'registered',
          title: 'ثبت پذیرش جدید در سامانه',
          description: `دستگاه با اولویت ${priority === 'urgent' ? 'فوری' : priority === 'high' ? 'بالا' : 'عادی'} در شعبه ${selectedBranch.name} پذیرش شد. پیامک اطلاع‌رسانی ارسال گردید.`,
          operatorName: 'مسئول پذیرش و تریاژ',
          userRole: 'receptionist',
        },
      ],
    };

    onSaveJob(newJob, newCustToSave, newSerialToSave);
    onOpenReceipt(newJob);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>پذیرش جدید کالا و ثبت گردش کار تعمیرات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ثبت اطلاعات مشتری، استعلام وضعیت گارانتی سریال، چک‌لیست سلامت ظاهری و اخذ امضای دیجیتال
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">کانال پذیرش:</span>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as ReceptionChannel)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
          >
            <option value="walk-in">مراجعه حضوری</option>
            <option value="branch">نمایندگی / شعبه</option>
            <option value="phone">تلفنی</option>
            <option value="online">آنلاین و پرتال</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Customer Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">۱</span>
              <span>مشخصات تحویل دهنده (مشتری)</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsNewCustomer(!isNewCustomer);
                setSelectedCustomer(null);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isNewCustomer ? 'جستجو در مشتریان قبلی' : '+ ایجاد مشتری جدید'}</span>
            </button>
          </div>

          {!isNewCustomer ? (
            <div>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجوی مشتری بر اساس نام، موبایل (0912...) یا کد ملی"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {filteredCustomers.length > 0 && !selectedCustomer && (
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-3 max-h-48 overflow-y-auto">
                  {filteredCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch('');
                      }}
                      className="p-3 hover:bg-blue-50 transition cursor-pointer border-b last:border-0 border-slate-100 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-slate-500 mr-2 font-mono">({c.mobile})</span>
                      </div>
                      <span className="text-slate-400">{c.city} - {c.address.slice(0, 30)}...</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer ? (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-blue-900 text-sm">{selectedCustomer.name}</div>
                    <div className="text-blue-700 mt-1">
                      موبایل: <span className="font-mono">{selectedCustomer.mobile}</span> | کد ملی: <span className="font-mono">{selectedCustomer.nationalCode}</span>
                    </div>
                    <div className="text-blue-600 text-[11px] mt-0.5">{selectedCustomer.address}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    تغییر مشتری
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-2">
                  برای شروع شماره موبایل مشتری را در کادر بالا جستجو کنید یا دکمه «ایجاد مشتری جدید» را بزنید.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="مثال: سهراب حسینی"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">شماره موبایل:</label>
                <input
                  type="text"
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                  placeholder="09121112233"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">کد ملی:</label>
                <input
                  type="text"
                  value={newCustNational}
                  onChange={(e) => setNewCustNational(e.target.value)}
                  placeholder="0071234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">آدرس کامل:</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="شهر، خیابان، پلاک، واحد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Serial & Product Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">۲</span>
              <span>شناسایی کالا و استعلام گارانتی سریال</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsNewSerial(!isNewSerial);
                setSelectedSerial(null);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isNewSerial ? 'جستجو در سریال‌های ثبت‌شده' : '+ ثبت سریال جدید کالا'}</span>
            </button>
          </div>

          {!isNewSerial ? (
            <div>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="اسکن بارکد یا تایپ شماره سریال (S/N) یا IMEI دستگاه"
                  value={serialSearch}
                  onChange={(e) => setSerialSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {filteredSerials.length > 0 && !selectedSerial && (
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-3 max-h-48 overflow-y-auto">
                  {filteredSerials.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSerial(s);
                        setSerialSearch('');
                        setWarrantyCondition(s.warrantyStatus === 'active' ? 'under_warranty' : 'out_of_warranty');
                      }}
                      className="p-3 hover:bg-blue-50 transition cursor-pointer border-b last:border-0 border-slate-100 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{s.productName}</span>
                        <span className="text-blue-700 mr-2 font-mono font-bold">S/N: {s.serialNumber}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.warrantyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {s.warrantyStatus === 'active' ? 'گارانتی فعال' : 'منقضی/فاقد گارانتی'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedSerial ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedSerial.brandName} - {selectedSerial.productName}</div>
                    <div className="text-slate-600 mt-1">
                      سریال: <span className="font-mono font-bold text-blue-700">{selectedSerial.serialNumber}</span>
                      {selectedSerial.imei && <span> | IMEI: <span className="font-mono">{selectedSerial.imei}</span></span>}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedSerial.warrantyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        وضعیت گارانتی: {selectedSerial.warrantyStatus === 'active' ? 'فعال شرکتی' : 'منقضی شده'}
                      </span>
                      <span className="text-slate-500 text-[11px]">پایان گارانتی: {selectedSerial.warrantyEndDate}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSerial(null)}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    تغییر سریال
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-2">
                  سریال موجود در کارت یا جعبه دستگاه را وارد فرمایید تا مشخصات فنی و گارانتی به صورت خودکار لود شود.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">مدل و کالا:</label>
                <select
                  value={selectedProduct?.id}
                  onChange={(e) => setSelectedProduct(products.find((p) => p.id === e.target.value) || null)}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">شماره سریال (یکتا):</label>
                <input
                  type="text"
                  value={newSerialNum}
                  onChange={(e) => setNewSerialNum(e.target.value)}
                  placeholder="مثال: R58N80A921L"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">کد IMEI (برای موبایل):</label>
                <input
                  type="text"
                  value={newSerialImei}
                  onChange={(e) => setNewSerialImei(e.target.value)}
                  placeholder="354892019482015"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Condition & Accessories Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">۳</span>
              <span>کنترل سلامت ظاهری دستگاه و لوازم همراه تحویلی</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Condition */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">وضعیت ظاهری و بدنه:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={visualCondition.scratches}
                    onChange={(e) => setVisualCondition({ ...visualCondition, scratches: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>خط و خش دارد</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={visualCondition.dents}
                    onChange={(e) => setVisualCondition({ ...visualCondition, dents: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>فرورفتگی بدنه / ضربه</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={visualCondition.cracks}
                    onChange={(e) => setVisualCondition({ ...visualCondition, cracks: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>شکستگی گلس / شیشه</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={visualCondition.tampered}
                    onChange={(e) => setVisualCondition({ ...visualCondition, tampered: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>آثار بازشدگی پیچ / دستکاری</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={visualCondition.waterDamage}
                    onChange={(e) => setVisualCondition({ ...visualCondition, waterDamage: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>سنسور رطوبت قرمز / آب‌خوردگی</span>
                </label>
              </div>
            </div>

            {/* Accessories Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">لوازم همراه تحویل‌شده:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={accessories.box}
                    onChange={(e) => setAccessories({ ...accessories, box: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>جعبه اصلی کالا</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={accessories.charger}
                    onChange={(e) => setAccessories({ ...accessories, charger: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>آداپتور و شارژر</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={accessories.cable}
                    onChange={(e) => setAccessories({ ...accessories, cable: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>کابل رابط / دیتا</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={accessories.warrantyCard}
                    onChange={(e) => setAccessories({ ...accessories, warrantyCard: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>کارت گارانتی فیزیکی</span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="سایر اقلام همراه (مثال: قاب ژله‌ای، تبدیل، قلم...)"
                  value={accessories.otherText || ''}
                  onChange={(e) => setAccessories({ ...accessories, otherText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Issues, Priority & Warranty Assessment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">۴</span>
              <span>ایراد اعلامی، تشخیص اولیه تریاژ و اولویت خدمات</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شعبه تحویل‌گیرنده:</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اولویت رسیدگی:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReceptionPriority)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
              >
                <option value="normal">عادی (Normal SLA)</option>
                <option value="high">بالا (High)</option>
                <option value="urgent">فوری / VIP (Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت اولیه شمول گارانتی:</label>
              <select
                value={warrantyCondition}
                onChange={(e) => setWarrantyCondition(e.target.value as ReceptionWarrantyCondition)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
              >
                <option value="under_warranty">مشمول خدمات رایگان گارانتی</option>
                <option value="out_of_warranty">خارج از گارانتی (آزاد و با هزینه)</option>
                <option value="pending_inspection">در انتظار بررسی فنی و کارشناسی</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ایراد اعلامی از زبان مشتری: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={customerComplaint}
                onChange={(e) => setCustomerComplaint(e.target.value)}
                placeholder="شرح دقیق مشکل دستگاه (مثال: پرش تصویر صفحه نمایش، داغ شدن هنگام شارژ سریع...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نظر اولیه کارشناس تریاژ / مشاهده عینی:
              </label>
              <textarea
                rows={2}
                value={expertInitialNotes}
                onChange={(e) => setExpertInitialNotes(e.target.value)}
                placeholder="توضیحات اولیه پذیرش‌گر برای تکنسین تعمیرات..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Digital Signature Pad */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">۵</span>
              <span>امضای دیجیتال و تایید نهایی مشتری (Digital Signature Pad)</span>
            </h2>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>پاک کردن امضا</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl bg-slate-50 p-2 flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-white rounded-lg border border-slate-300 cursor-crosshair shadow-inner w-full max-w-lg touch-none"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              مشتری محترم لطفاً در کادر بالا با قلم، انگشت یا ماوس امضا نمایید.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            <span>ثبت نهایی پذیرش و صدور قبض رهگیری (JS-Ticket)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
