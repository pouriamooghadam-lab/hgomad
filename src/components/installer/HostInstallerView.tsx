import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Server,
  Download,
  FileCode,
  CheckCircle2,
  Copy,
  Terminal,
  Shield,
  ExternalLink,
  BookOpen,
  Play,
  Database,
  Lock,
  FolderArchive,
  Layers,
  FileText,
  Printer,
  MessageSquare,
  Users,
  Wrench,
  Boxes,
} from 'lucide-react';
import {
  INSTALL_PHP_CODE,
  DATABASE_SQL_CODE,
  HTACCESS_CODE,
  CONFIG_SAMPLE_PHP,
  README_INSTALL_GUIDE,
} from '../../data/installerScripts';
import {
  API_INDEX_PHP,
  API_DB_PHP,
  API_AUTH_PHP,
  API_JOBS_PHP,
  API_INVENTORY_PHP,
  API_CUSTOMERS_PHP,
  API_SMS_PHP,
  API_PRINT_RECEIPT_PHP,
  API_ONSITE_PHP,
  API_SCRAP_PHP,
  API_FAULT_TREE_PHP,
  API_SURVEY_PHP,
  API_WARRANTY_PHP,
  UPLOADS_HTACCESS_CODE,
  STANDALONE_DASHBOARD_HTML,
} from '../../data/backendPhpScripts';

type AvailableFile =
  | 'install.php'
  | 'database.sql'
  | '.htaccess'
  | 'config.sample.php'
  | 'api/index.php'
  | 'api/db.php'
  | 'api/auth.php'
  | 'api/jobs.php'
  | 'api/inventory.php'
  | 'api/customers.php'
  | 'api/sms.php'
  | 'api/print_receipt.php'
  | 'api/onsite.php'
  | 'api/scrap.php'
  | 'api/fault_tree.php'
  | 'api/survey.php'
  | 'api/warranty.php'
  | 'uploads/.htaccess'
  | 'index.html'
  | 'README_INSTALL.txt';

export const HostInstallerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'download' | 'code' | 'structure' | 'simulator' | 'guide'>('download');
  const [selectedCodeFile, setSelectedCodeFile] = useState<AvailableFile>('api/index.php');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Simulator State
  const [simStep, setSimStep] = useState(1);
  const [simDbHost, setSimDbHost] = useState('localhost');
  const [simDbName, setSimDbName] = useState('cpaneluser_jservice');
  const [simDbUser, setSimDbUser] = useState('cpaneluser_dbuser');
  const [simDbPass, setSimDbPass] = useState('MyStrongPass#2024');
  const [simAdminMobile, setSimAdminMobile] = useState('09121112233');

  // Single-Click ZIP Generator with ALL Backend PHP & Frontend Files
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // 1. Root Core Files
      zip.file('install.php', INSTALL_PHP_CODE);
      zip.file('database.sql', DATABASE_SQL_CODE);
      zip.file('.htaccess', HTACCESS_CODE);
      zip.file('config.sample.php', CONFIG_SAMPLE_PHP);
      zip.file('README_INSTALL.txt', README_INSTALL_GUIDE);
      zip.file('index.html', STANDALONE_DASHBOARD_HTML);

      // 2. Complete PHP REST API Folder (api/)
      const apiFolder = zip.folder('api');
      apiFolder?.file('index.php', API_INDEX_PHP);
      apiFolder?.file('db.php', API_DB_PHP);
      apiFolder?.file('auth.php', API_AUTH_PHP);
      apiFolder?.file('jobs.php', API_JOBS_PHP);
      apiFolder?.file('inventory.php', API_INVENTORY_PHP);
      apiFolder?.file('customers.php', API_CUSTOMERS_PHP);
      apiFolder?.file('sms.php', API_SMS_PHP);
      apiFolder?.file('print_receipt.php', API_PRINT_RECEIPT_PHP);
      apiFolder?.file('onsite.php', API_ONSITE_PHP);
      apiFolder?.file('scrap.php', API_SCRAP_PHP);
      apiFolder?.file('fault_tree.php', API_FAULT_TREE_PHP);
      apiFolder?.file('survey.php', API_SURVEY_PHP);
      apiFolder?.file('warranty.php', API_WARRANTY_PHP);

      // 3. Uploads directory with security hardening (.htaccess)
      const uploads = zip.folder('uploads');
      uploads?.file('.htaccess', UPLOADS_HTACCESS_CODE);
      uploads?.file('.gitkeep', '');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jservice-full-suite-php-mysql.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating zip', e);
      alert('خطا در فشرده‌سازی فایل نصاب.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeContent = (): string => {
    switch (selectedCodeFile) {
      case 'install.php':
        return INSTALL_PHP_CODE;
      case 'database.sql':
        return DATABASE_SQL_CODE;
      case '.htaccess':
        return HTACCESS_CODE;
      case 'config.sample.php':
        return CONFIG_SAMPLE_PHP;
      case 'api/index.php':
        return API_INDEX_PHP;
      case 'api/db.php':
        return API_DB_PHP;
      case 'api/auth.php':
        return API_AUTH_PHP;
      case 'api/jobs.php':
        return API_JOBS_PHP;
      case 'api/inventory.php':
        return API_INVENTORY_PHP;
      case 'api/customers.php':
        return API_CUSTOMERS_PHP;
      case 'api/sms.php':
        return API_SMS_PHP;
      case 'api/print_receipt.php':
        return API_PRINT_RECEIPT_PHP;
      case 'api/onsite.php':
        return API_ONSITE_PHP;
      case 'api/scrap.php':
        return API_SCRAP_PHP;
      case 'api/fault_tree.php':
        return API_FAULT_TREE_PHP;
      case 'api/survey.php':
        return API_SURVEY_PHP;
      case 'api/warranty.php':
        return API_WARRANTY_PHP;
      case 'uploads/.htaccess':
        return UPLOADS_HTACCESS_CODE;
      case 'index.html':
        return STANDALONE_DASHBOARD_HTML;
      case 'README_INSTALL.txt':
        return README_INSTALL_GUIDE;
      default:
        return '';
    }
  };

  const fileManifest = [
    {
      name: 'install.php',
      category: 'نصاب خودکار',
      icon: Play,
      color: 'text-emerald-500 bg-emerald-50',
      desc: 'ویزارد ۴ مرحله‌ای گرافیکی جهت بررسی اکستنشن‌های PHP، تست کانکشن MySQL، ساخت خودکار جداول و ساخت اکانت مدیر ارشد.',
    },
    {
      name: 'database.sql',
      category: 'پایگاه داده',
      icon: Database,
      color: 'text-blue-500 bg-blue-50',
      desc: 'شمای کامل رابطه‌ای با ۱۳ جدول (کاربران، پرونده‌ها، قطعات، انبار، تراکنش‌های مالی، گارانتی، لاگ پیامک) با Collation فارسی.',
    },
    {
      name: 'api/index.php',
      category: 'هسته وب‌سرویس',
      icon: Terminal,
      color: 'text-indigo-500 bg-indigo-50',
      desc: 'مسیریاب اصلی REST API برای دریافت درخواست‌های فرانت‌اند، مدیریت هدرهای CORS و روتینگ به کنترلرهای پرونده، پذیرش و انبار.',
    },
    {
      name: 'api/db.php',
      category: 'لایه اتصال امن',
      icon: Shield,
      color: 'text-cyan-500 bg-cyan-50',
      desc: 'کلاس شیءگرای Singleton PDO با Prepared Statements استاندارد جهت پیشگیری ۱۰۰٪ از حملات SQL Injection.',
    },
    {
      name: 'api/auth.php',
      category: 'احراز هویت و RBAC',
      icon: Users,
      color: 'text-amber-500 bg-amber-50',
      desc: 'کنترلر بررسی ورود با هش Bcrypt، مدیریت سشن‌ها و بررسی دسترسی تفکیک‌شده برای ۱۲ نقش کاربری مختلف سیستم.',
    },
    {
      name: 'api/jobs.php',
      category: 'موتور پرونده‌ها',
      icon: Wrench,
      color: 'text-purple-500 bg-purple-50',
      desc: 'مدیریت چرخه ۱۷ وضعیتی پرونده‌های تعمیرات، ثبت پذیرش، صدور کد رهگیری یکتا، تخصیص تکنسین و استعلام عمومی مشتری.',
    },
    {
      name: 'api/inventory.php',
      category: 'انبار و قطعات',
      icon: Boxes,
      color: 'text-teal-500 bg-teal-50',
      desc: 'ثبت و کسری موجودی قطعات مصرفی، کنترل آستانه هشدار کسری انبار مرکزی و ثبت حواله‌های انبار به شعب.',
    },
    {
      name: 'api/customers.php',
      category: 'CRM مشتریان',
      icon: Users,
      color: 'text-sky-500 bg-sky-50',
      desc: 'جستجوی هوشمند بر اساس موبایل و کدملی، تشکیل پرونده مشتریان حقیقی و حقوقی و مدیریت سوابق خدمات گذشته.',
    },
    {
      name: 'api/sms.php',
      category: 'درگاه پیامک',
      icon: MessageSquare,
      color: 'text-pink-500 bg-pink-50',
      desc: 'سیستم ارسال پیامک خودکار اطلاع‌رسانی پذیرش و ترخیص دستگاه با پشتیبانی از کاوه‌نگار، فراز اس‌ام‌اس و ملی‌پیامک.',
    },
    {
      name: 'api/print_receipt.php',
      category: 'صدور رسید چاپی',
      icon: Printer,
      color: 'text-orange-500 bg-orange-50',
      desc: 'قالب اختصاصی رسید فیزیکی A5 با بارکد کد رهگیری، مشخصات فنی دستگاه، امضای مشتری و شرایط حقوقی گارانتی.',
    },
    {
      name: 'api/onsite.php',
      category: 'اعزام و سرویس در محل',
      icon: Wrench,
      color: 'text-blue-500 bg-blue-50',
      desc: 'مدیریت اعزام سرویس‌کار در محل مشتری، محاسبه کرایه و ایاب ذهاب بر اساس زون شهری و امضای دیجیتال تحویل کار.',
    },
    {
      name: 'api/scrap.php',
      category: 'انبار داغی و قطعات امانی',
      icon: Boxes,
      color: 'text-rose-500 bg-rose-50',
      desc: 'انبار قطعات مستعمل و داغی تعویض‌شده، الصاق بارکد رهگیری، رسید قطعه و کنترل انبارک سیار (خودروی تکنسین‌ها).',
    },
    {
      name: 'api/fault_tree.php',
      category: 'درخت عیب‌یابی',
      icon: Terminal,
      color: 'text-amber-500 bg-amber-50',
      desc: 'بانک کدهای خطا، فلوچارت عیب‌یابی گام‌به‌گام و راهنمای استانداردهای تعمیراتی مشابه سیستم‌های سون‌پرو و سروشان.',
    },
    {
      name: 'api/survey.php',
      category: 'نظرسنجی CSAT',
      icon: MessageSquare,
      color: 'text-emerald-500 bg-emerald-50',
      desc: 'وب‌سرویس دریافت نظرات مشتریان، محاسبه نمره رضایت‌سنجی ۱ تا ۵ ستاره و تاثیر در کارنامه فنی تکنسین.',
    },
    {
      name: 'api/warranty.php',
      category: 'فعال‌سازی گارانتی',
      icon: Shield,
      color: 'text-teal-500 bg-teal-50',
      desc: 'پورتال فعال‌سازی آنلاین گارانتی توسط خریدار نهایی، بررسی اصالت کالا و استعلام تاریخ انقضای کارت طلایی.',
    },
    {
      name: 'uploads/.htaccess',
      category: 'امنیت آپلود',
      icon: Lock,
      color: 'text-red-500 bg-red-50',
      desc: 'ضد هک و غیرفعال‌سازی قطعی اجرای کدهای PHP در پوشه آپلود فایل‌ها جهت ارتقای امنیت هاست اشتراکی به سطح Enterprise.',
    },
    {
      name: 'index.html',
      category: 'داشبورد وب',
      icon: Layers,
      color: 'text-blue-500 bg-blue-50',
      desc: 'رابط کاربری پیشرفته و واکنش‌گرای وب جهت اجرا در مرورگر، متصل به فایل‌های PHP بدون نیاز به نصب نودجی‌اس روی سرور.',
    },
    {
      name: '.htaccess',
      category: 'امنیت آپاچی',
      icon: Lock,
      color: 'text-red-500 bg-red-50',
      desc: 'تنظیمات امنیتی هاست اشتراکی شامل هدرهای CSP و X-Frame، فشرده‌سازی خودکار GZIP و مسدودسازی دسترسی به فایل‌های حساس.',
    },
    {
      name: 'config.sample.php',
      category: 'پیکربندی',
      icon: FileCode,
      color: 'text-slate-500 bg-slate-50',
      desc: 'نمونه فایل کانکشن دیتابیس برای کاربرانی که تمایل دارند به صورت دستی مشخصات MySQL را وارد نمایند.',
    },
    {
      name: 'README_INSTALL.txt',
      category: 'دفترچه راهنما',
      icon: BookOpen,
      color: 'text-emerald-500 bg-emerald-50',
      desc: 'راهنمای گام‌به‌گام تصویری و متنی استقرار روی کنترل‌پنل‌های cPanel، DirectAdmin و Plesk به زبان فارسی.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              پکیج کامل Full-Stack ویژه هاست اشتراکی (PHP + MySQL + REST API + UI)
            </span>
            <span className="text-xs text-slate-300">بدون نیاز به سرور مجازی، بدون نیاز به Node.js</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            پکیج جامع نرم‌افزار و نصاب خودکار جی سرویس (شامل تمامی ۱۴ فایل سیستمی)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
            این پکیج فشرده، فقط یک فایل نصاب ساده نیست؛ بلکه شامل **کل هسته بک‌اند PHP (پوشه کامل API، دیتابیس رابطه‌ای، کنترلرهای پرونده، احراز هویت، پیامک، چاپ رسید) و فایل‌های فرانت‌اند وب** است که مستقیماً در <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono">public_html</code> هاست cPanel یا DirectAdmin قرار گرفته و با یک کلیک راه‌اندازی می‌شود.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{isZipping ? 'در حال تجمیع و فشرده‌سازی ۱۴ فایل...' : 'دانلود پکیج کامل فول‌استک (ZIP Installer)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl text-xs backdrop-blur-xs transition flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>مشاهده ساختار کامل فایل‌ها و پوشه‌ها</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold px-4 py-3 rounded-xl text-xs transition flex items-center gap-2 border border-emerald-500/30 cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>مشاهده مستقیم کدهای PHP و API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('download')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'download' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>لیست فایل‌های داخل پکیج (Manifest)</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'structure' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>درخت فایل‌ها روی هاست</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'code' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>کدهای سورس PHP و وب‌سرویس‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'simulator' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>شبیه‌ساز مراحل نصب روی هاست</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'guide' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>راهنمای گام‌به‌گام cPanel</span>
        </button>
      </div>

      {/* TAB 1: Package Manifest */}
      {activeTab === 'download' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-950">
            <div>
              <span className="font-bold text-sm block mb-0.5">📦 پکیج خروجی کامل و بدون نیاز به نصب هیچ پیش‌نیاز سروری</span>
              <span>تمام کدهای مورد نیاز برای ذخیره در پایگاه داده، احراز هویت، چاپ رسید، ارسال اس‌ام‌اس و مدیریت وضعیت‌ها در فایل زیپ قرار داده شده‌اند.</span>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              دانلود یکجای ZIP (شامل همه موارد)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fileManifest.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.name} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start gap-4 hover:border-slate-300 transition">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 font-mono" dir="ltr">{item.name}</span>
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">{item.category}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCodeFile(item.name as AvailableFile);
                          setActiveTab('code');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] underline cursor-pointer"
                      >
                        مشاهده سورس کد ←
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: File Structure Tree */}
      {activeTab === 'structure' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-bold text-sm">ساختار پوشه‌ها و فایل‌های استخراج‌شده در public_html:</span>
            <span className="text-xs text-slate-400 font-sans">تعداد فایل‌های عملیاتی: ۱۹ فایل کامل</span>
          </div>

          <pre dir="ltr" className="leading-relaxed text-slate-300 overflow-x-auto p-2">
{`public_html/
│
├── .htaccess                      # تنظیمات امنیتی آپاچی، هدرهای CSP و بازنویسی مسیرها
├── install.php                    # ویزارد ۴ مرحله‌ای نصاب خودکار تحت وب
├── database.sql                   # شمای دیتابیس MySQL (۲۲ جدول، ایندکس‌ها، UTF8MB4)
├── config.sample.php              # نمونه فایل اتصال پایگاه داده (الگو)
├── config.php                     # فایل تنظیمات اصلی (پس از اتمام نصب خودکار ایجاد می‌شود)
├── index.html                     # داشبورد پیشرفته سیستم و فرم‌های عملیاتی
├── README_INSTALL.txt             # راهنمای متنی نصب سریع در cPanel و DirectAdmin
│
├── api/                           # پوشه وب‌سرویس‌ها و کنترلرهای بک‌اند PHP
│   ├── index.php                  # روت اصلی REST API و دریافت اکشن‌ها
│   ├── db.php                     # لایه ارتباط ایمن به دیتابیس با PDO Singleton
│   ├── auth.php                   # لاگین، ضد Brute-Force، بررسی دسترسی نقش‌ها (RBAC)
│   ├── jobs.php                   # موتور گردش کار ۱۷ وضعیتی، پذیرش، تخصیص تکنسین
│   ├── onsite.php                 # اعزام سرویس‌کار در محل، ایاب ذهاب و مناطق شهری
│   ├── scrap.php                  # انبار قطعات داغی و انبارک سیار تکنسین‌ها (امانی)
│   ├── fault_tree.php             # درخت تصمیم‌گیری عیب‌یابی و بانک کدهای خطای فنی
│   ├── survey.php                 # نظرسنجی پیامکی CSAT و کارنامه رضایت مشتریان
│   ├── warranty.php               # فعال‌سازی آنلاین گارانتی توسط خریدار و اصالت کالا
│   ├── inventory.php              # مدیریت انبارها، موجودی قطعات و هشدارهای کسری
│   ├── customers.php              # پایگاه داده و CRM ۳۶۰ درجه مشتریان
│   ├── sms.php                    # وب‌سرویس ارسال پیامک خودکار (الگوها و متغیرها)
│   └── print_receipt.php          # موتور تولید رسید چاپی فیزیکی A5 با بارکد و قوانین
│
└── uploads/                       # پوشه نگهداری تصاویر پیوست و امضای دیجیتال
    ├── .htaccess                  # امنیت آپلود: php_flag engine off (ضد شل و ضد نفوذ)
    └── .gitkeep`}
          </pre>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
            💡 <strong>چگونه کار می‌کند؟</strong> پس از آپلود و اکسترکت این پکیج در هاست اشتراکی، کاربر ابتدا فایل <code className="text-emerald-400 font-mono">install.php</code> را باز کرده تا دیتابیس ساخته شود. سپس سیستم بلافاصله از طریق پوشه <code className="text-emerald-400 font-mono">api/</code> تمامی درخواست‌های ثبت پذیرش، جستجو، تغییر وضعیت، انبارداری و چاپ را مستقیماً بر روی دیتابیس MySQL هاست شما بدون نیاز به هیچ سرور جانبی اجرا می‌کند.
          </div>
        </div>
      )}

      {/* TAB 3: Source Code Inspector */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'api/index.php',
                  'api/jobs.php',
                  'api/onsite.php',
                  'api/scrap.php',
                  'api/fault_tree.php',
                  'api/survey.php',
                  'api/warranty.php',
                  'api/auth.php',
                  'api/db.php',
                  'api/inventory.php',
                  'api/sms.php',
                  'api/print_receipt.php',
                  'uploads/.htaccess',
                  'install.php',
                  'database.sql',
                  'index.html',
                  '.htaccess',
                  'config.sample.php',
                  'README_INSTALL.txt',
                ] as AvailableFile[]
              ).map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedCodeFile(file)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                    selectedCodeFile === file
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  dir="ltr"
                >
                  {file}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopyCode(getCodeContent())}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'کپی شد ✓' : 'کپی سورس فایل'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-[11px] overflow-x-auto max-h-[550px] border border-slate-800">
            <div className="flex justify-between items-center text-slate-500 pb-2 mb-2 border-b border-slate-800 text-[10px]">
              <span dir="ltr">File: {selectedCodeFile}</span>
              <span>تعداد کاراکتر: {getCodeContent().length.toLocaleString()}</span>
            </div>
            <pre dir="ltr" className="leading-relaxed">
              {getCodeContent()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Interactive Host Simulator */}
      {activeTab === 'simulator' && (
        <div className="max-w-2xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 text-center">
            <span className="text-[11px] font-bold text-emerald-400 font-mono">SIMULATION MODE (تست مستقیم نحوه کارکرد نصاب)</span>
            <h2 className="text-lg font-black text-white mt-1">شبیه‌ساز اجرای فایل install.php روی هاست</h2>
          </div>

          {/* Steps Breadcrumb */}
          <div className="flex justify-between text-xs font-bold text-slate-500 border-b border-slate-800 pb-3">
            <span className={simStep === 1 ? 'text-emerald-400 font-bold' : ''}>۱. تست پیش‌نیازها</span>
            <span className={simStep === 2 ? 'text-emerald-400 font-bold' : ''}>۲. اتصال دیتابیس</span>
            <span className={simStep === 3 ? 'text-emerald-400 font-bold' : ''}>۳. اکانت مدیر کل</span>
            <span className={simStep === 4 ? 'text-emerald-400 font-bold' : ''}>۴. پایان نصب</span>
          </div>

          {simStep === 1 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300">بررسی خودکار نیازمندی‌های هاست لینوکس:</p>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span>PHP Version (&gt;= 7.4)</span>
                  <span className="text-emerald-400 font-bold font-mono">8.2.14 ✓ تایید</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span>PDO MySQL Extension</span>
                  <span className="text-emerald-400 font-bold">فعال ✓ تایید</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span>cURL & JSON Support</span>
                  <span className="text-emerald-400 font-bold">فعال ✓ تایید</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span>مجوز نوشتن در پوشه (Write Permission)</span>
                  <span className="text-emerald-400 font-bold font-mono">0755 ✓ مجاز</span>
                </div>
              </div>

              <button
                onClick={() => setSimStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                مرحله بعد: تنظیمات MySQL ←
              </button>
            </div>
          )}

          {simStep === 2 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300">اطلاعات دیتابیس ساخته‌شده در cPanel:</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Database Host:</label>
                  <input
                    type="text"
                    value={simDbHost}
                    onChange={(e) => setSimDbHost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Database Name:</label>
                  <input
                    type="text"
                    value={simDbName}
                    onChange={(e) => setSimDbName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Database Username:</label>
                  <input
                    type="text"
                    value={simDbUser}
                    onChange={(e) => setSimDbUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Database Password:</label>
                  <input
                    type="password"
                    value={simDbPass}
                    onChange={(e) => setSimDbPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSimStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  بازگشت
                </button>
                <button
                  onClick={() => setSimStep(3)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  تست اتصال و مرحله بعد ←
                </button>
              </div>
            </div>
          )}

          {simStep === 3 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300">تعیین مشخصات مدیر ارشد سیستم (Super-Admin):</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">شماره موبایل مدیر (شناسه ورود):</label>
                  <input
                    type="text"
                    value={simAdminMobile}
                    onChange={(e) => setSimAdminMobile(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">رمز عبور ورود به سامانه:</label>
                  <input
                    type="password"
                    defaultValue="Admin@2024#Service"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => setSimStep(4)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                اجرای کوئری‌های database.sql و ساخت جداول ←
              </button>
            </div>
          )}

          {simStep === 4 && (
            <div className="text-center py-6 space-y-4 text-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h3 className="text-lg font-bold text-emerald-300">نصب با موفقیت شبیه‌سازی شد!</h3>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                تمام ۱۳ جدول با استاندارد utf8mb4 ایجاد شدند، فایل <code className="text-emerald-300">config.php</code> ساخته شد و سیستم با قفل امنیتی <code className="text-emerald-300">installed.lock</code> ایمن گردید.
              </p>
              <button
                onClick={() => setSimStep(1)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl font-bold cursor-pointer"
              >
                تست مجدد شبیه‌ساز
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Step-by-Step Manual */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-800 leading-relaxed">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>راهنمای جامع تصویری و متنی نصب در cPanel و DirectAdmin</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">گام اول: ورود به File Manager و آپلود فایل نصاب</h4>
              <p>
                وارد کنترل پنل cPanel شوید. آیکون <strong>File Manager</strong> را باز کرده و به دایرکتوری <code>public_html</code> (یا پوشه ساب‌دامین مثلاً <code>service.yourdomain.ir</code>) بروید.
                فایل زیپ دانلود شده از این بخش را آپلود نموده و روی آن راست کلیک کرده و گزینه <strong>Extract</strong> را انتخاب فرمایید.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">گام دوم: ساخت پایگاه داده MySQL</h4>
              <p>
                در صفحه اصلی cPanel به بخش <strong>Databases</strong> و گزینه <strong>MySQL Database Wizard</strong> بروید:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 mr-2">
                <li>یک نام دلخواه برای دیتابیس وارد کنید (مثلاً jservice).</li>
                <li>یک نام کاربری و یک پسورد پیچیده بسازید و آن را یادداشت کنید.</li>
                <li>تیک گزینه <strong>ALL PRIVILEGES</strong> را بزنید تا تمام دسترسی‌ها داده شود.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">گام سوم: باز کردن install.php در مرورگر</h4>
              <p>
                مرورگر اینترنت خود را باز کرده و آدرس دامنه خود را فراخوانی کنید:
                <br />
                <code className="text-blue-700 font-mono font-bold">https://yourdomain.ir/install.php</code>
                <br />
                فرم هوشمند مشخصات دیتابیس را از شما دریافت نموده و ظرف چند ثانیه سامانه را آماده بهره‌برداری می‌کند!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
