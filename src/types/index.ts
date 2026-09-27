// ==========================================
// JSERVICE Types & Interfaces
// Comprehensive After-Sales & Warranty ERP
// ==========================================

export type UserRole =
  | 'super-admin'
  | 'admin'
  | 'technical-manager'
  | 'technician'
  | 'receptionist'
  | 'warehouse-manager'
  | 'finance-manager'
  | 'crm-expert'
  | 'qc-inspector'
  | 'replacement-expert'
  | 'branch-manager'
  | 'branch-user';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  avatar?: string;
  role: UserRole;
  roleTitle: string;
  branchId?: string;
  branchName?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type CustomerType = 'real' | 'legal';
export type CustomerVip = 'normal' | 'silver' | 'gold' | 'platinum';
export type CustomerSource = 'walk-in' | 'phone' | 'online' | 'instagram' | 'website' | 'referral' | 'other';

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  mobile: string;
  phone?: string;
  nationalCode: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  customerType: CustomerType;
  source: CustomerSource;
  vipLevel: CustomerVip;
  notes?: string;
  balance: number; // Positive = credit, negative = debt
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  country: string;
  logo?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  icon?: string;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  model: string;
  sku: string;
  defaultWarrantyMonths: number;
  description?: string;
  imageUrl?: string;
}

export type WarrantyType = 'corporate' | 'branch' | 'extended' | 'part' | 'repair' | 'none';
export type WarrantyStatus = 'active' | 'expired' | 'voided' | 'not_activated';
export type SerialStatus = 'in_stock' | 'sold' | 'in_service' | 'replaced' | 'scrapped';

export interface SerialHistoryEvent {
  id: string;
  date: string;
  type: 'creation' | 'sale' | 'activation' | 'reception' | 'repair' | 'part_replacement' | 'warranty_change' | 'transfer' | 'void';
  title: string;
  description: string;
  operatorName: string;
  referenceCode?: string;
}

export interface Serial {
  id: string;
  serialNumber: string;
  imei?: string;
  batchNumber?: string;
  productId: string;
  productName: string;
  brandName: string;
  model: string;
  productionDate: string;
  saleDate?: string;
  customerId?: string;
  customerName?: string;
  customerMobile?: string;
  branchId: string;
  branchName: string;
  warrantyType: WarrantyType;
  warrantyStatus: WarrantyStatus;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: SerialStatus;
  voidReason?: string;
  history: SerialHistoryEvent[];
}

export type ReceptionPriority = 'normal' | 'high' | 'urgent';
export type ReceptionWarrantyCondition = 'under_warranty' | 'out_of_warranty' | 'pending_inspection';
export type ReceptionChannel = 'walk-in' | 'branch' | 'phone' | 'online';

export interface VisualCondition {
  scratches: boolean; // خط و خش
  dents: boolean;     // فرورفتگی
  cracks: boolean;    // شکستگی
  colorFading: boolean; // رنگ‌پریدگی
  tampered: boolean;   // بازشدگی / دستکاری
  waterDamage: boolean; // آب‌خوردگی
  otherNotes?: string;
}

export interface Accessories {
  charger: boolean;
  cable: boolean;
  battery: boolean;
  box: boolean;
  warrantyCard: boolean;
  purchaseInvoice: boolean;
  adapter: boolean;
  otherText?: string;
}

export type JobStatus =
  | 'registered'                 // پذیرش
  | 'in_transit'                  // در حال ارسال
  | 'waiting_for_tech_manager'    // ارجاع به مدیر فنی
  | 'assigned_to_tech'           // تخصیص تکنسین
  | 'waiting_for_customer_call'   // منتظر تماس مشتری
  | 'referred_to_crm'             // ارجاع به امور مشتریان
  | 'waiting_for_cost_approval'   // منتظر تایید هزینه
  | 'cost_approved'               // تایید هزینه شد
  | 'waiting_for_parts'           // منتظر قطعه
  | 'in_repair'                   // در حال تعمیر
  | 'in_qc'                       // کنترل کیفی
  | 'qc_failed'                   // رد تست کیفی
  | 'qc_passed'                   // تایید کنترل کیفی
  | 'waiting_for_replacement'     // در انتظار تعویض
  | 'waiting_for_dispatch'        // منتظر ارسال/تحویل
  | 'completed'                   // تکمیل و تحویل
  | 'canceled';                   // لغو شده

export interface JobTimelineEvent {
  id: string;
  timestamp: string;
  status: JobStatus;
  title: string;
  description: string;
  operatorName: string;
  userRole: string;
}

export interface Job {
  id: string;
  trackingCode: string; // e.g. JS-1403-000101
  localReceptionNumber: string; // e.g. BR-TEH-104
  createdAt: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  serialId: string;
  serialNumber: string;
  imei?: string;
  productName: string;
  productModel: string;
  brandName: string;
  channel: ReceptionChannel;
  priority: ReceptionPriority;
  warrantyCondition: ReceptionWarrantyCondition;
  customerComplaint: string; // ایراد اعلامی مشتری
  expertInitialNotes: string; // تشخیص اولیه کارشناس
  visualCondition: VisualCondition;
  accessories: Accessories;
  signatureDataUrl?: string; // امضای دیجیتال
  photos: string[];
  currentStatus: JobStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  branchId: string;
  branchName: string;
  targetBranchId?: string;
  transferTrackingCode?: string;
  estimatedCost: number;
  finalCost: number;
  isWarrantyApprovedByTech?: boolean;
  isWarrantyApprovedByManager?: boolean;
  warrantyRejectionReason?: string;
  timeline: JobTimelineEvent[];
}

export interface FaultTreeNode {
  id: string;
  title: string;
  category: string;
  children?: FaultTreeNode[];
}

export interface RepairAction {
  id: string;
  jobId: string;
  actionType: 'diagnosis' | 'repair' | 'part_replacement' | 'cleaning' | 'testing' | 'software_update';
  title: string;
  description: string;
  durationMinutes: number;
  technicianId: string;
  technicianName: string;
  timestamp: string;
}

export interface Part {
  id: string;
  code: string;
  name: string;
  brandName: string;
  category: string;
  compatibleModels: string[];
  barcode: string;
  storageBin: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  warrantyCost: number;
  minStock: number;
  currentStock: number;
}

export type WarehouseType = 'central' | 'service' | 'branch' | 'technician' | 'scrap' | 'quarantine' | 'salvage';

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  managerName: string;
  location: string;
  itemsCount: number;
}

export type PartRequestStatus = 'pending' | 'approved' | 'rejected' | 'delivered';

export interface PartRequest {
  id: string;
  jobId: string;
  trackingCode: string;
  partId: string;
  partName: string;
  partCode: string;
  quantity: number;
  requestedByTechnicianId: string;
  requestedByTechnicianName: string;
  warehouseId: string;
  warehouseName: string;
  status: PartRequestStatus;
  requestDate: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface ScrapPart {
  id: string;
  partId: string;
  partName: string;
  jobId: string;
  trackingCode: string;
  technicianName: string;
  receivedDate: string;
  conditionStatus: 'in_review' | 'repairable' | 'scrapped' | 'returned_to_vendor';
  notes?: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  name: string;
  personnelCode: string;
  specialties: string[];
  skillLevel: 'Junior' | 'Mid' | 'Senior' | 'Expert';
  dailyCapacity: number;
  currentActiveJobs: number;
  hourlyRate: number;
  commissionPercentage: number;
  completedRepairsCount: number;
  successRate: number; // 98%
  reworkCount: number;
  rating: number; // 4.9
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  type: 'central' | 'branch' | 'agency';
  managerName: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  maxDailyIntake: number;
  activeJobsCount: number;
}

export interface InterBranchTransfer {
  id: string;
  jobId: string;
  trackingCode: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  carrier: 'Tipax' | 'Post' | 'Barbari' | 'Courier' | 'Internal';
  carrierTrackingNumber: string;
  dispatchDate: string;
  receivedDate?: string;
  status: 'in_transit' | 'received' | 'returned';
  notes?: string;
}

export interface ServiceTariff {
  id: string;
  code: string;
  title: string;
  category: string;
  basePrice: number;
  warrantyDiscountPct: number;
}

export interface InvoiceItem {
  id: string;
  type: 'service' | 'part' | 'shipping' | 'inspection';
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warrantyDiscount: number;
  isCoveredByWarranty: boolean;
}

export type PaymentMethod = 'cash' | 'card' | 'pos' | 'online' | 'check' | 'credit';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber: string;
  paidAt: string;
  receivedBy: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-1403-0001
  jobId: string;
  trackingCode: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  warrantyDiscountTotal: number;
  tax: number;
  totalPayable: number;
  paidAmount: number;
  status: 'draft' | 'pending_payment' | 'paid' | 'canceled';
  issuedAt: string;
  payments: Payment[];
}

export interface SmsLog {
  id: string;
  mobile: string;
  recipientName: string;
  event: string;
  messageText: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
  provider: string;
}

export interface SmsTemplate {
  id: string;
  event: string;
  title: string;
  templateText: string;
  variables: string[];
  isEnabled: boolean;
}

export interface LicenseInfo {
  companyName: string;
  licenseKey: string;
  status: 'valid' | 'expired' | 'trial';
  expiresAt: string;
  licensedBranches: number;
  licensedUsers: number;
  serverUrl: string;
  lastVerifiedAt: string;
  activeModules: {
    core: boolean;
    smsGateway: boolean;
    multiBranch: boolean;
    digitalSignatures: boolean;
    warrantyApprovalEngine: boolean;
    scrapManagement: boolean;
    financeAndTariffs: boolean;
    publicPortal: boolean;
    onsiteDispatch?: boolean;
    faultTree?: boolean;
    csatSurvey?: boolean;
  };
}

// ==========================================
// Sarvshan, Emka & 7Pro Enterprise Additions
// ==========================================

export type OnsiteDispatchStatus = 'scheduled' | 'technician_en_route' | 'arrived' | 'completed' | 'canceled';
export type OnsiteTimeSlot = 'morning' | 'afternoon' | 'evening';
export type OnsiteZone = 'inside_city' | 'suburbs' | 'intercity';

export interface OnsiteDispatch {
  id: string;
  trackingCode: string;
  jobId: string;
  customerName: string;
  customerMobile: string;
  address: string;
  province: string;
  city: string;
  district: string;
  scheduledDate: string;
  timeSlot: OnsiteTimeSlot;
  technicianId: string;
  technicianName: string;
  travelCost: number;
  zone: OnsiteZone;
  status: OnsiteDispatchStatus;
  customerSignatureUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface TechnicianVanInventory {
  id: string;
  technicianId: string;
  technicianName: string;
  partId: string;
  partName: string;
  partCode: string;
  quantityOnHand: number;
  consignedDate: string;
  status: 'active' | 'reconciled';
}

export interface ScrapItem {
  id: string;
  jobId: string;
  trackingCode: string;
  partId: string;
  partName: string;
  partCode: string;
  serialOrBarcode: string;
  technicianId: string;
  technicianName: string;
  receptionDate: string;
  failureCause: string;
  disposition: 'scrap_heap' | 'return_to_manufacturer' | 'refurbish' | 'quarantine';
  isVerifiedByQC: boolean;
  barcode: string;
}

export interface FaultTreeGuide {
  id: string;
  category: string;
  brand: string;
  model: string;
  errorCode: string;
  symptom: string;
  possibleCauses: string[];
  stepByStepTest: string[];
  recommendedPart: string;
  estimatedRepairTimeMin: number;
}

export interface CsatSurvey {
  id: string;
  jobId: string;
  trackingCode: string;
  customerName: string;
  customerMobile: string;
  technicianId: string;
  technicianName: string;
  rating: number; // 1 to 5
  punctualityScore: number;
  behaviorScore: number;
  qualityScore: number;
  feedback: string;
  createdAt: string;
}

export interface ConsumerWarrantyActivation {
  id: string;
  serialNumber: string;
  productName: string;
  model: string;
  customerName: string;
  customerMobile: string;
  customerNationalCode: string;
  purchaseDate: string;
  dealerStoreName: string;
  invoiceNumber: string;
  invoicePhotoUrl?: string;
  warrantyMonths: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  status: 'activated' | 'under_review' | 'rejected';
  activationCode: string;
  createdAt: string;
}

