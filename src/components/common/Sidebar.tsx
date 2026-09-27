import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Users,
  Cpu,
  ShieldAlert,
  Boxes,
  UserCheck,
  Building2,
  Receipt,
  MessageSquare,
  BarChart3,
  Key,
  Server,
  ChevronLeft,
  Car,
  Trash2,
  GitFork,
  Star,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'reception'
  | 'jobs'
  | 'onsite-dispatch'
  | 'scrap-parts'
  | 'fault-tree'
  | 'csat-survey'
  | 'consumer-warranty'
  | 'customers'
  | 'serials'
  | 'warranty'
  | 'inventory'
  | 'technicians'
  | 'branches'
  | 'finance'
  | 'sms'
  | 'reports'
  | 'license'
  | 'host-installer';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingJobsCount: number;
  partRequestsCount: number;
}

interface MenuItem {
  id: NavTab;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
  isSpecial?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingJobsCount,
  partRequestsCount,
}) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', title: 'داشبورد لایو', icon: LayoutDashboard },
    { id: 'reception', title: 'پذیرش کالا و تریاژ', icon: ClipboardList },
    {
      id: 'jobs',
      title: 'گردش کار و جاب‌ها',
      icon: Wrench,
      badge: pendingJobsCount,
      badgeColor: 'bg-blue-600 text-white',
    },
    { id: 'onsite-dispatch', title: 'سرویس و اعزام در محل', icon: Car },
    { id: 'scrap-parts', title: 'انبار داغی و قطعات امانی', icon: Trash2 },
    { id: 'fault-tree', title: 'درخت عیب‌یابی و کدهای خطا', icon: GitFork },
    { id: 'csat-survey', title: 'نظرسنجی و رضایت CSAT', icon: Star },
    { id: 'consumer-warranty', title: 'فعال‌سازی آنلاین گارانتی', icon: ShieldCheck },
    { id: 'customers', title: 'مشتریان (CRM ۳۶۰°)', icon: Users },
    { id: 'serials', title: 'کالا و مدیریت سریال‌ها', icon: Cpu },
    { id: 'warranty', title: 'مدیریت و تایید گارانتی', icon: ShieldAlert },
    {
      id: 'inventory',
      title: 'انبارداری و قطعات یدکی',
      icon: Boxes,
      badge: partRequestsCount,
      badgeColor: 'bg-amber-600 text-white',
    },
    { id: 'technicians', title: 'تکنسین‌ها و ظرفیت کاری', icon: UserCheck },
    { id: 'branches', title: 'شعب و حواله‌های ترنسفر', icon: Building2 },
    { id: 'finance', title: 'مالی، فاکتور و تسویه', icon: Receipt },
    { id: 'sms', title: 'سامانه پیامک و نوتیفیکیشن', icon: MessageSquare },
    { id: 'reports', title: 'گزارشات و آنالیز خرابی', icon: BarChart3 },
    { id: 'license', title: 'لایسنس و اتصال سرور', icon: Key },
    {
      id: 'host-installer',
      title: '🚀 نصاب هاست اشتراکی',
      icon: Server,
      isSpecial: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)] border-l border-slate-800">
      <div className="p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          ماژول‌های ERP خدمات پس از فروش
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : item.isSpecial
                    ? 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isSpecial ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronLeft className="w-3.5 h-3.5 opacity-70" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">لایسنس شرکتی فعال</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-400">سامانه متصل به سرور مرکزی لایسنس</p>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">JS-ENT-2024-9981-PRO</div>
        </div>
      </div>
    </aside>
  );
};
