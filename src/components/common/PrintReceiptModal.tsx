import React from 'react';
import { Job, Customer } from '../../types';
import { Printer, X, ShieldCheck, QrCode } from 'lucide-react';
import { JobStatusBadge } from './StatusBadge';

interface PrintReceiptModalProps {
  job: Job;
  customer?: Customer;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ job, customer, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Action Header - hidden in print */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">رسید چاپی استاندارد پذیرش دستگاه (JS-Receipt)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ رسید مشتری</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-8 text-slate-800 bg-white" id="receipt-printable-area">
          {/* Top Receipt Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xl">
                JS
              </div>
              <div>
                <h1 className="font-black text-lg text-slate-900">سامانه خدمات پس از فروش و گارانتی جی سرویس</h1>
                <p className="text-xs text-slate-500">مرکز تخصصی تعمیرات و پشتیبانی سخت‌افزار و الکترونیک</p>
                <p className="text-[11px] text-slate-500">تلفن پشتیبانی: ۰۲۱-۸۸۹۹۰۰۰۰ | وب‌سایت: www.jservice.ir</p>
              </div>
            </div>

            <div className="text-left font-mono">
              <div className="text-xs text-slate-500">شماره پذیرش سراسری:</div>
              <div className="font-black text-base text-blue-700 tracking-wider">{job.trackingCode}</div>
              <div className="text-[11px] text-slate-500 mt-1">شماره محلی: {job.localReceptionNumber}</div>
              <div className="text-[11px] text-slate-500">تاریخ: {job.createdAt}</div>
            </div>
          </div>

          {/* Barcode & QR Code Section */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">استعلام آنلاین وضعیت دستگاه:</div>
                <div className="text-[11px] text-slate-600 font-mono">https://jservice.ir/track/{job.trackingCode}</div>
                <div className="text-[10px] text-slate-500">با دوربین تلفن همراه اسکن نمایید</div>
              </div>
            </div>

            <div className="text-center font-mono">
              {/* Simulated Code-128 Barcode */}
              <div className="h-9 px-4 bg-white border border-slate-300 rounded flex items-center justify-center space-x-1 space-x-reverse">
                <span className="w-1 h-7 bg-black inline-block"></span>
                <span className="w-0.5 h-7 bg-black inline-block"></span>
                <span className="w-1.5 h-7 bg-black inline-block"></span>
                <span className="w-0.5 h-7 bg-black inline-block"></span>
                <span className="w-2 h-7 bg-black inline-block"></span>
                <span className="w-1 h-7 bg-black inline-block"></span>
                <span className="w-1.5 h-7 bg-black inline-block"></span>
                <span className="w-0.5 h-7 bg-black inline-block"></span>
                <span className="w-2 h-7 bg-black inline-block"></span>
              </div>
              <div className="text-[11px] text-slate-700 mt-0.5 font-bold">{job.trackingCode}</div>
            </div>
          </div>

          {/* Customer & Device Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Customer Box */}
            <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                <span>مشخصات تحویل دهنده (مشتری)</span>
                <span className="text-[10px] text-slate-500">شعبه: {job.branchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">نام و نام خانوادگی:</span>
                <span className="font-bold text-slate-800">{job.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">شماره موبایل:</span>
                <span className="font-mono font-bold text-slate-800">{job.customerMobile}</span>
              </div>
              {customer && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">کد ملی / شناسه ملی:</span>
                    <span className="font-mono text-slate-800">{customer.nationalCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">شهر و آدرس:</span>
                    <span className="text-slate-700 text-[11px] truncate max-w-[200px]">{customer.city} - {customer.address}</span>
                  </div>
                </>
              )}
            </div>

            {/* Device Box */}
            <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                <span>مشخصات دستگاه و گارانتی</span>
                <JobStatusBadge status={job.currentStatus} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">کالا و برند:</span>
                <span className="font-bold text-slate-800">{job.brandName} - {job.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">مدل فنی:</span>
                <span className="font-mono font-bold text-slate-800">{job.productModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">شماره سریال:</span>
                <span className="font-mono font-bold text-blue-700">{job.serialNumber}</span>
              </div>
              {job.imei && (
                <div className="flex justify-between">
                  <span className="text-slate-500">IMEI دستگاه:</span>
                  <span className="font-mono text-slate-800">{job.imei}</span>
                </div>
              )}
            </div>
          </div>

          {/* Condition & Accessories Checklist */}
          <div className="border border-slate-200 rounded-xl p-3 text-xs mb-4">
            <div className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1">
              کنترل ظاهری و لوازم همراه تحویلی
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">وضعیت ظاهری:</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded ${job.visualCondition.scratches ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-500 line-through'}`}>
                    خط و خش
                  </span>
                  <span className={`px-2 py-0.5 rounded ${job.visualCondition.dents ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-500 line-through'}`}>
                    فرورفتگی
                  </span>
                  <span className={`px-2 py-0.5 rounded ${job.visualCondition.cracks ? 'bg-red-100 text-red-900 font-bold' : 'bg-slate-100 text-slate-500 line-through'}`}>
                    شکستگی
                  </span>
                  <span className={`px-2 py-0.5 rounded ${job.visualCondition.tampered ? 'bg-red-100 text-red-900 font-bold' : 'bg-slate-100 text-slate-500 line-through'}`}>
                    دستکاری قبلی
                  </span>
                  <span className={`px-2 py-0.5 rounded ${job.visualCondition.waterDamage ? 'bg-red-100 text-red-900 font-bold' : 'bg-slate-100 text-slate-500 line-through'}`}>
                    آب‌خوردگی
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">لوازم همراه تحویل‌شده:</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded ${job.accessories.box ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>جعبه</span>
                  <span className={`px-2 py-0.5 rounded ${job.accessories.charger ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>شارژر</span>
                  <span className={`px-2 py-0.5 rounded ${job.accessories.cable ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>کابل</span>
                  <span className={`px-2 py-0.5 rounded ${job.accessories.warrantyCard ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>کارت گارانتی</span>
                  {job.accessories.otherText && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      سایر: {job.accessories.otherText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Faults & Notes */}
          <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-2 mb-4">
            <div>
              <span className="font-bold text-slate-800">ایراد اعلامی مشتری: </span>
              <span className="text-slate-700">{job.customerComplaint}</span>
            </div>
            {job.expertInitialNotes && (
              <div>
                <span className="font-bold text-slate-800">نظر اولیه کارشناس تریاژ: </span>
                <span className="text-slate-700">{job.expertInitialNotes}</span>
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-600 leading-relaxed mb-6">
            <div className="font-bold text-slate-800 mb-1">قوانین و شرایط پذیرش دستگاه:</div>
            ۱. تحویل دستگاه تنها با ارائه اصل این قبض پذیرش و کارت شناسایی معتبر امکان‌پذیر است.<br/>
            ۲. مرکز خدمات هیچ‌گونه مسئولیتی در قبال حفظ اطلاعات نرم‌افزاری و فایل‌های شخصی دستگاه ندارد. پشتیبان‌گیری بر عهده مشتری است.<br/>
            ۳. در صورت انقضای گارانتی یا صدمات فیزیکی (ضربه، آب‌خوردگی، نوسان برق و دستکاری)، تعمیرات پس از اعلام هزینه و اخذ تاییدیه مشتری انجام خواهد شد.<br/>
            ۴. قطعات تعویض‌شده خارج از گارانتی دارای ۳ ماه و اجرت تعمیر دارای ۱ ماه گارانتی رسمی می‌باشند.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs text-center">
            <div>
              <div className="text-slate-500 mb-2">امضا و تایید مشتری:</div>
              {job.signatureDataUrl ? (
                <div className="h-16 flex items-center justify-center">
                  <img src={job.signatureDataUrl} alt="امضای مشتری" className="max-h-16 object-contain" />
                </div>
              ) : (
                <div className="h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400">
                  محل امضای الکترونیک
                </div>
              )}
              <div className="font-bold text-slate-800 mt-1">{job.customerName}</div>
            </div>

            <div>
              <div className="text-slate-500 mb-2">مهر و امضای پذیرش‌گر:</div>
              <div className="h-16 flex items-center justify-center font-bold text-blue-800">
                مرکز خدمات پس از فروش جی سرویس
              </div>
              <div className="font-bold text-slate-800 mt-1">{job.branchName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
