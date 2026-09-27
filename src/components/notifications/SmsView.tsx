import React, { useState } from 'react';
import { SmsLog, SmsTemplate } from '../../types';
import { MessageSquare, Send, CheckCircle2, Settings, History } from 'lucide-react';

interface SmsViewProps {
  smsLogs: SmsLog[];
  templates: SmsTemplate[];
  onSendTestSms: (mobile: string, text: string) => void;
}

export const SmsView: React.FC<SmsViewProps> = ({ smsLogs, templates, onSendTestSms }) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'templates' | 'settings'>('logs');
  const [testMobile, setTestMobile] = useState('09121112233');
  const [testText, setTestText] = useState('مشتری گرامی، دستگاه شما با کد رهگیری JS-1403-000101 آماده تحویل است.');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMobile || !testText) return;
    onSendTestSms(testMobile, testText);
    alert('پیامک آزمایشی با وب‌سرویس پترن کاوه‌نگار با موفقیت ارسال شد.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>سامانه پیامک هوشمند و اطلاع‌رسانی رویدادهای تعمیرات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ارسال خودکار کد رهگیری، تغییر وضعیت‌ها، اعلام برآورد هزینه و آماده‌باش تحویل کالا به مشتری
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          لاگ پیامک‌های ارسالی ({smsLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'templates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          قالب‌های پیامک پترن ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          تست و تنظیمات وب‌سرویس
        </button>
      </div>

      {activeTab === 'logs' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5">گیرنده</th>
                <th className="p-3.5">شماره موبایل</th>
                <th className="p-3.5">متن پیامک ارسالی</th>
                <th className="p-3.5">تاریخ و ساعت</th>
                <th className="p-3.5">درگاه ارسال</th>
                <th className="p-3.5">وضعیت تحویل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-3.5 font-bold text-slate-900">{log.recipientName}</td>
                  <td className="p-3.5 font-mono text-slate-700">{log.mobile}</td>
                  <td className="p-3.5 text-slate-700 max-w-md leading-relaxed">{log.messageText}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.sentAt}</td>
                  <td className="p-3.5 text-slate-500">{log.provider}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      تحویل شده ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'templates' ? (
        <div className="space-y-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900">{tpl.title}</span>
                <span className="text-[11px] text-slate-400 font-mono">Event: {tpl.event}</span>
              </div>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] leading-relaxed">
                {tpl.templateText}
              </p>
              <div className="flex gap-1.5 pt-1">
                {tpl.variables.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono">
                    {'{' + v + '}'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-lg space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">ارسال پیامک تستی به مشتری</h3>
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">شماره موبایل گیرنده:</label>
              <input
                type="text"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">متن پیامک:</label>
              <textarea
                rows={3}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیامک آزمایشی</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
