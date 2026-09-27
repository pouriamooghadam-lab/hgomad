/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Job,
  Customer,
  Product,
  Serial,
  Part,
  Warehouse,
  PartRequest,
  ScrapPart,
  TechnicianProfile,
  Branch,
  InterBranchTransfer,
  ServiceTariff,
  Invoice,
  SmsLog,
  SmsTemplate,
  LicenseInfo,
  JobStatus,
  PaymentMethod,
} from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ReceptionView } from './components/reception/ReceptionView';
import { JobsView } from './components/jobs/JobsView';
import { JobDetailModal } from './components/jobs/JobDetailModal';
import { CustomersView } from './components/customers/CustomersView';
import { SerialsView } from './components/serials/SerialsView';
import { WarrantyView } from './components/warranty/WarrantyView';
import { InventoryView } from './components/inventory/InventoryView';
import { TechniciansView } from './components/technicians/TechniciansView';
import { BranchesView } from './components/branches/BranchesView';
import { FinanceView } from './components/finance/FinanceView';
import { SmsView } from './components/notifications/SmsView';
import { ReportsView } from './components/reports/ReportsView';
import { LicenseView } from './components/license/LicenseView';
import { HostInstallerView } from './components/installer/HostInstallerView';
import { PublicPortalView } from './components/public/PublicPortalView';
import { OnsiteDispatchView } from './components/onsite/OnsiteDispatchView';
import { ScrapPartsView } from './components/scrap/ScrapPartsView';
import { FaultTreeEngineView } from './components/faultTree/FaultTreeEngineView';
import { CsatSurveyView } from './components/csat/CsatSurveyView';
import { ConsumerWarrantyActivationView } from './components/warranty/ConsumerWarrantyActivationView';
import { LoginView } from './components/auth/LoginView';

export default function App() {
  // App Navigation & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('js_auth_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; mobile: string; roleTitle: string } | null>(() => {
    const saved = sessionStorage.getItem('js_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = sessionStorage.getItem('js_auth_role');
    return (savedRole as UserRole) || 'super-admin';
  });
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isPublicPortalOpen, setIsPublicPortalOpen] = useState(false);

  const handleLoginSuccess = (role: UserRole, user: { name: string; mobile: string; roleTitle: string }) => {
    setCurrentRole(role);
    setCurrentUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem('js_auth_logged_in', 'true');
    sessionStorage.setItem('js_auth_user', JSON.stringify(user));
    sessionStorage.setItem('js_auth_role', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('js_auth_logged_in');
    sessionStorage.removeItem('js_auth_user');
    sessionStorage.removeItem('js_auth_role');
  };

  // Core Data Entities from Storage
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serials, setSerials] = useState<Serial[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [scrapParts, setScrapParts] = useState<ScrapPart[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transfers, setTransfers] = useState<InterBranchTransfer[]>([]);
  const [tariffs, setTariffs] = useState<ServiceTariff[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [license, setLicense] = useState<LicenseInfo>(StorageService.getLicense());

  // Active Modals State
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForReceipt, setSelectedJobForReceipt] = useState<Job | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setJobs(StorageService.getJobs());
    setCustomers(StorageService.getCustomers());
    setProducts(StorageService.getProducts());
    setSerials(StorageService.getSerials());
    setParts(StorageService.getParts());
    setWarehouses(StorageService.getWarehouses());
    setPartRequests(StorageService.getPartRequests());
    setScrapParts(StorageService.getScrapParts());
    setTechnicians(StorageService.getTechnicians());
    setBranches(StorageService.getBranches());
    setTransfers(StorageService.getTransfers());
    setTariffs(StorageService.getTariffs());
    setInvoices(StorageService.getInvoices());
    setSmsLogs(StorageService.getSmsLogs());
    setSmsTemplates(StorageService.getSmsTemplates());
    setLicense(StorageService.getLicense());
  }, []);

  // Handlers for Jobs & Receptions
  const handleSaveJob = (newJob: Job, newCustomer?: Customer, newSerial?: Serial) => {
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    StorageService.saveJobs(updatedJobs);

    if (newCustomer) {
      const updatedCusts = [newCustomer, ...customers];
      setCustomers(updatedCusts);
      StorageService.saveCustomers(updatedCusts);
    }

    if (newSerial) {
      const updatedSerials = [newSerial, ...serials];
      setSerials(updatedSerials);
      StorageService.saveSerials(updatedSerials);
    }

    // Trigger Automatic SMS Notification Log
    const newSms: SmsLog = {
      id: `sms-${Date.now()}`,
      mobile: newJob.customerMobile,
      recipientName: newJob.customerName,
      event: 'reception_registered',
      messageText: `مشتری گرامی ${newJob.customerName}، پذیرش دستگاه شما با کد رهگیری ${newJob.trackingCode} در سامانه جی سرویس ثبت گردید.`,
      sentAt: '1403/07/06 - هم اکنون',
      status: 'delivered',
      provider: 'Kavenegar Pattern API',
    };
    const updatedSms = [newSms, ...smsLogs];
    setSmsLogs(updatedSms);
    StorageService.saveSmsLogs(updatedSms);
  };

  const handleUpdateJobStatus = (jobId: string, newStatus: JobStatus, note?: string) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: '1403/07/06 - 12:45',
          status: newStatus,
          title: `تغییر وضعیت به: ${newStatus}`,
          description: note || `وضعیت پرونده توسط ${currentRole} بروزرسانی گردید.`,
          operatorName: currentRole === 'super-admin' ? 'مدیر کل سیستم' : 'کاربر پرسنل',
          userRole: currentRole,
        };

        const updatedJob: Job = {
          ...job,
          currentStatus: newStatus,
          timeline: [newTimelineEvent, ...job.timeline],
        };

        if (selectedJobForDetail && selectedJobForDetail.id === jobId) {
          setSelectedJobForDetail(updatedJob);
        }
        return updatedJob;
      }
      return job;
    });

    setJobs(updatedJobs);
    StorageService.saveJobs(updatedJobs);
  };

  const handleAssignTechnician = (jobId: string, technicianId: string, technicianName: string) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        const updated: Job = {
          ...j,
          assignedTechnicianId: technicianId,
          assignedTechnicianName: technicianName,
          currentStatus: 'assigned_to_tech',
          timeline: [
            {
              id: `tl-${Date.now()}`,
              timestamp: '1403/07/06 - 12:50',
              status: 'assigned_to_tech',
              title: `تخصیص به تکنسین ${technicianName}`,
              description: 'پرونده جهت بررسی عیب و تعمیرات تخصصی تحویل داده شد.',
              operatorName: 'مدیر فنی',
              userRole: currentRole,
            },
            ...j.timeline,
          ],
        };
        if (selectedJobForDetail && selectedJobForDetail.id === jobId) {
          setSelectedJobForDetail(updated);
        }
        return updated;
      }
      return j;
    });

    setJobs(updatedJobs);
    StorageService.saveJobs(updatedJobs);
  };

  const handleClaimJob = (jobId: string) => {
    const activeTech = technicians[0];
    handleAssignTechnician(jobId, activeTech.id, activeTech.name);
  };

  const handleApproveWarrantyByTech = (jobId: string) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        const u: Job = {
          ...j,
          isWarrantyApprovedByTech: true,
          timeline: [
            {
              id: `tl-${Date.now()}`,
              timestamp: '1403/07/06 - 12:55',
              status: j.currentStatus,
              title: 'تایید کارشناسی گارانتی توسط تکنسین',
              description: 'سلامت سریال و انطباق با ضوابط گارانتی تایید شد و جهت تصویب نهایی به مدیر فنی ارسال گردید.',
              operatorName: 'سهراب رضایی',
              userRole: 'technician',
            },
            ...j.timeline,
          ],
        };
        if (selectedJobForDetail?.id === jobId) setSelectedJobForDetail(u);
        return u;
      }
      return j;
    });
    setJobs(updated);
    StorageService.saveJobs(updated);
  };

  const handleApproveWarrantyByManager = (jobId: string, approved: boolean, reason?: string) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        const u: Job = {
          ...j,
          isWarrantyApprovedByManager: approved,
          warrantyRejectionReason: approved ? undefined : reason,
          warrantyCondition: approved ? 'under_warranty' : 'out_of_warranty',
          timeline: [
            {
              id: `tl-${Date.now()}`,
              timestamp: '1403/07/06 - 13:00',
              status: j.currentStatus,
              title: approved ? 'تصویب رسمی پوشش گارانتی توسط مدیر فنی' : 'رد ادعای گارانتی و ابطال به دلیل صدمه فیزیکی',
              description: approved
                ? 'مجوز تامین رایگان کلیه قطعات و عدم اخذ اجرت صادر گردید.'
                : `علت ابطال گارانتی: ${reason || 'خارج از شرایط ضوابط'}`,
              operatorName: 'مدیر فنی',
              userRole: 'technical-manager',
            },
            ...j.timeline,
          ],
        };
        if (selectedJobForDetail?.id === jobId) setSelectedJobForDetail(u);
        return u;
      }
      return j;
    });
    setJobs(updated);
    StorageService.saveJobs(updated);
  };

  // Part Requests
  const handleRequestPart = (jobId: string, partId: string, quantity: number) => {
    const part = parts.find((p) => p.id === partId);
    const job = jobs.find((j) => j.id === jobId);
    if (!part || !job) return;

    const newReq: PartRequest = {
      id: `pr-${Date.now()}`,
      jobId,
      trackingCode: job.trackingCode,
      partId,
      partName: part.name,
      partCode: part.code,
      quantity,
      requestedByTechnicianId: 'tp-1',
      requestedByTechnicianName: 'سهراب رضایی',
      warehouseId: 'wh-1',
      warehouseName: 'انبار مرکزی قطعات یدکی',
      status: 'pending',
      requestDate: '1403/07/06 - 13:10',
    };

    const updatedRequests = [newReq, ...partRequests];
    setPartRequests(updatedRequests);
    StorageService.savePartRequests(updatedRequests);

    handleUpdateJobStatus(jobId, 'waiting_for_parts', `درخواست حواله قطعه ${part.name} (تعداد: ${quantity}) به انبار مرکزی ثبت شد.`);
  };

  const handleApprovePartRequest = (requestId: string) => {
    const target = partRequests.find((r) => r.id === requestId);
    if (!target) return;

    // Deduct stock from parts
    const updatedParts = parts.map((p) => {
      if (p.id === target.partId) {
        return { ...p, currentStock: Math.max(0, p.currentStock - target.quantity) };
      }
      return p;
    });
    setParts(updatedParts);
    StorageService.saveParts(updatedParts);

    // Update Request status
    const updatedReqs = partRequests.map((r) => {
      if (r.id === requestId) {
        return { ...r, status: 'approved' as const, approvedDate: '1403/07/06 - 13:15' };
      }
      return r;
    });
    setPartRequests(updatedReqs);
    StorageService.savePartRequests(updatedReqs);

    // Move Job back to in_repair
    handleUpdateJobStatus(target.jobId, 'in_repair', `قطعه ${target.partName} توسط انباردار تحویل گردید و روند تعمیر ادامه یافت.`);
  };

  const handleRejectPartRequest = (requestId: string, reason: string) => {
    const updatedReqs = partRequests.map((r) => {
      if (r.id === requestId) {
        return { ...r, status: 'rejected' as const, rejectionReason: reason };
      }
      return r;
    });
    setPartRequests(updatedReqs);
    StorageService.savePartRequests(updatedReqs);
  };

  // Finance payments
  const handleRecordPayment = (invoiceId: string, amount: number, method: PaymentMethod) => {
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        return {
          ...inv,
          paidAmount: newPaid,
          status: newPaid >= inv.totalPayable ? ('paid' as const) : ('pending_payment' as const),
        };
      }
      return inv;
    });
    setInvoices(updatedInvoices);
    StorageService.saveInvoices(updatedInvoices);
  };

  // Add Part / Add Customer / Add Serial / Add Transfer
  const handleAddCustomer = (c: Customer) => {
    const updated = [c, ...customers];
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  const handleAddSerial = (s: Serial) => {
    const updated = [s, ...serials];
    setSerials(updated);
    StorageService.saveSerials(updated);
  };

  const handleAddPart = (p: Part) => {
    const updated = [p, ...parts];
    setParts(updated);
    StorageService.saveParts(updated);
  };

  const handleAddTransfer = (tr: InterBranchTransfer) => {
    const updated = [tr, ...transfers];
    setTransfers(updated);
    StorageService.saveTransfers(updated);
  };

  const handleSendTestSms = (mobile: string, text: string) => {
    const newLog: SmsLog = {
      id: `sms-${Date.now()}`,
      mobile,
      recipientName: 'مشتری گرامی',
      event: 'manual_notification',
      messageText: text,
      sentAt: '1403/07/06 - هم اکنون',
      status: 'delivered',
      provider: 'Kavenegar Pattern API',
    };
    const updated = [newLog, ...smsLogs];
    setSmsLogs(updated);
    StorageService.saveSmsLogs(updated);
  };

  const handleResetData = () => {
    if (confirm('آیا از بازنشانی داده‌های نمونه اولیه به حالت اولیه اطمینان دارید؟')) {
      StorageService.resetAll();
      window.location.reload();
    }
  };

  // Global Search Handler
  const handleGlobalSearch = (q: string) => {
    if (!q.trim()) return;
    setActiveTab('jobs');
  };

  // Render Public Portal if open
  if (isPublicPortalOpen) {
    return (
      <PublicPortalView
        jobs={jobs}
        serials={serials}
        onBackToApp={() => setIsPublicPortalOpen(false)}
      />
    );
  }

  // Mandatory Authentication Gate for Company ERP
  if (!isAuthenticated) {
    if (activeTab === 'host-installer') {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-bold cursor-pointer"
            >
              ← بازگشت به صفحه ورود
            </button>
            <span className="text-xs text-slate-400 font-medium">نصاب و پکیج استقرار هاست اشتراکی cPanel / DirectAdmin</span>
          </div>
          <div className="p-4 max-w-7xl mx-auto">
            <HostInstallerView />
          </div>
        </div>
      );
    }

    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onOpenPublicPortal={() => setIsPublicPortalOpen(true)}
        onOpenInstaller={() => setActiveTab('host-installer')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={setCurrentRole}
        onOpenPublicPortal={() => setIsPublicPortalOpen(true)}
        onOpenHostInstaller={() => setActiveTab('host-installer')}
        onOpenNewReception={() => setActiveTab('reception')}
        onGlobalSearch={handleGlobalSearch}
        onResetData={handleResetData}
        onLogout={handleLogout}
        activeJobsCount={jobs.length}
      />

      {/* Main Body Area: Sidebar + Active Module View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingJobsCount={jobs.filter((j) => j.currentStatus === 'registered' || j.currentStatus === 'waiting_for_tech_manager').length}
          partRequestsCount={partRequests.filter((r) => r.status === 'pending').length}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              jobs={jobs}
              customers={customers}
              parts={parts}
              technicians={technicians}
              partRequests={partRequests}
              onNavigateToJobs={(filter) => setActiveTab('jobs')}
              onNavigateToReception={() => setActiveTab('reception')}
              onSelectJob={(j) => setSelectedJobForDetail(j)}
            />
          )}

          {activeTab === 'reception' && (
            <ReceptionView
              customers={customers}
              products={products}
              serials={serials}
              branches={branches}
              onSaveJob={handleSaveJob}
              onOpenReceipt={(j) => setSelectedJobForReceipt(j)}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsView
              jobs={jobs}
              technicians={technicians}
              currentRole={currentRole}
              branches={branches}
              onUpdateJobStatus={handleUpdateJobStatus}
              onAssignTechnician={handleAssignTechnician}
              onClaimJob={handleClaimJob}
              onSelectJob={(j) => setSelectedJobForDetail(j)}
              onPrintReceipt={(j) => setSelectedJobForReceipt(j)}
            />
          )}

          {activeTab === 'onsite-dispatch' && <OnsiteDispatchView />}

          {activeTab === 'scrap-parts' && <ScrapPartsView />}

          {activeTab === 'fault-tree' && <FaultTreeEngineView />}

          {activeTab === 'csat-survey' && <CsatSurveyView />}

          {activeTab === 'consumer-warranty' && <ConsumerWarrantyActivationView />}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              jobs={jobs}
              serials={serials}
              onAddCustomer={handleAddCustomer}
              onSelectJob={(j) => setSelectedJobForDetail(j)}
            />
          )}

          {activeTab === 'serials' && (
            <SerialsView
              serials={serials}
              products={products}
              onAddSerial={handleAddSerial}
            />
          )}

          {activeTab === 'warranty' && <WarrantyView serials={serials} />}

          {activeTab === 'inventory' && (
            <InventoryView
              parts={parts}
              warehouses={warehouses}
              partRequests={partRequests}
              scrapParts={scrapParts}
              onApprovePartRequest={handleApprovePartRequest}
              onRejectPartRequest={handleRejectPartRequest}
              onAddPart={handleAddPart}
            />
          )}

          {activeTab === 'technicians' && <TechniciansView technicians={technicians} />}

          {activeTab === 'branches' && (
            <BranchesView
              branches={branches}
              transfers={transfers}
              onAddTransfer={handleAddTransfer}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              invoices={invoices}
              tariffs={tariffs}
              onRecordPayment={handleRecordPayment}
            />
          )}

          {activeTab === 'sms' && (
            <SmsView
              smsLogs={smsLogs}
              templates={smsTemplates}
              onSendTestSms={handleSendTestSms}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              jobs={jobs}
              parts={parts}
              technicians={technicians}
            />
          )}

          {activeTab === 'license' && (
            <LicenseView
              license={license}
              onUpdateLicense={(l) => {
                setLicense(l);
                StorageService.saveLicense(l);
              }}
            />
          )}

          {activeTab === 'host-installer' && <HostInstallerView />}
        </main>
      </div>

      {/* Printable Receipt Modal */}
      {selectedJobForReceipt && (
        <PrintReceiptModal
          job={selectedJobForReceipt}
          customer={customers.find((c) => c.id === selectedJobForReceipt.customerId)}
          onClose={() => setSelectedJobForReceipt(null)}
        />
      )}

      {/* Comprehensive Job Inspection & Repair Modal */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          parts={parts}
          technicians={technicians}
          tariffs={tariffs}
          currentRole={currentRole}
          onClose={() => setSelectedJobForDetail(null)}
          onUpdateStatus={handleUpdateJobStatus}
          onRequestPart={handleRequestPart}
          onApproveWarrantyByTech={handleApproveWarrantyByTech}
          onApproveWarrantyByManager={handleApproveWarrantyByManager}
          onPrintReceipt={(j) => setSelectedJobForReceipt(j)}
        />
      )}
    </div>
  );
}
