import {
  User,
  Customer,
  Product,
  Serial,
  Job,
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
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_SERIALS,
  INITIAL_JOBS,
  INITIAL_PARTS,
  INITIAL_WAREHOUSES,
  INITIAL_PART_REQUESTS,
  INITIAL_SCRAP_PARTS,
  INITIAL_TECHNICIANS,
  INITIAL_BRANCHES,
  INITIAL_TRANSFERS,
  INITIAL_SERVICE_TARIFFS,
  INITIAL_INVOICES,
  INITIAL_SMS_LOGS,
  INITIAL_SMS_TEMPLATES,
  INITIAL_LICENSE,
  INITIAL_ONSITE_DISPATCHES,
  INITIAL_VAN_INVENTORY,
  INITIAL_SCRAP_ITEMS,
  INITIAL_FAULT_GUIDES,
  INITIAL_CSAT_SURVEYS,
  INITIAL_WARRANTY_ACTIVATIONS,
} from '../data/mockData';

const STORAGE_KEY_PREFIX = 'jservice_v1_';

function getOrInit<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}

export const StorageService = {
  getUsers: (): User[] => getOrInit('users', INITIAL_USERS),
  saveUsers: (data: User[]) => save('users', data),

  getCustomers: (): Customer[] => getOrInit('customers', INITIAL_CUSTOMERS),
  saveCustomers: (data: Customer[]) => save('customers', data),

  getProducts: (): Product[] => getOrInit('products', INITIAL_PRODUCTS),
  saveProducts: (data: Product[]) => save('products', data),

  getSerials: (): Serial[] => getOrInit('serials', INITIAL_SERIALS),
  saveSerials: (data: Serial[]) => save('serials', data),

  getJobs: (): Job[] => getOrInit('jobs', INITIAL_JOBS),
  saveJobs: (data: Job[]) => save('jobs', data),

  getParts: (): Part[] => getOrInit('parts', INITIAL_PARTS),
  saveParts: (data: Part[]) => save('parts', data),

  getWarehouses: (): Warehouse[] => getOrInit('warehouses', INITIAL_WAREHOUSES),
  saveWarehouses: (data: Warehouse[]) => save('warehouses', data),

  getPartRequests: (): PartRequest[] => getOrInit('part_requests', INITIAL_PART_REQUESTS),
  savePartRequests: (data: PartRequest[]) => save('part_requests', data),

  getScrapParts: (): ScrapPart[] => getOrInit('scrap_parts', INITIAL_SCRAP_PARTS),
  saveScrapParts: (data: ScrapPart[]) => save('scrap_parts', data),

  getTechnicians: (): TechnicianProfile[] => getOrInit('technicians', INITIAL_TECHNICIANS),
  saveTechnicians: (data: TechnicianProfile[]) => save('technicians', data),

  getBranches: (): Branch[] => getOrInit('branches', INITIAL_BRANCHES),
  saveBranches: (data: Branch[]) => save('branches', data),

  getTransfers: (): InterBranchTransfer[] => getOrInit('transfers', INITIAL_TRANSFERS),
  saveTransfers: (data: InterBranchTransfer[]) => save('transfers', data),

  getTariffs: (): ServiceTariff[] => getOrInit('tariffs', INITIAL_SERVICE_TARIFFS),
  saveTariffs: (data: ServiceTariff[]) => save('tariffs', data),

  getInvoices: (): Invoice[] => getOrInit('invoices', INITIAL_INVOICES),
  saveInvoices: (data: Invoice[]) => save('invoices', data),

  getSmsLogs: (): SmsLog[] => getOrInit('sms_logs', INITIAL_SMS_LOGS),
  saveSmsLogs: (data: SmsLog[]) => save('sms_logs', data),

  getSmsTemplates: (): SmsTemplate[] => getOrInit('sms_templates', INITIAL_SMS_TEMPLATES),
  saveSmsTemplates: (data: SmsTemplate[]) => save('sms_templates', data),

  getLicense: (): LicenseInfo => getOrInit('license', INITIAL_LICENSE),
  saveLicense: (data: LicenseInfo) => save('license', data),

  getOnsiteDispatches: () => getOrInit('onsite_dispatches', INITIAL_ONSITE_DISPATCHES),
  saveOnsiteDispatches: (data: any) => save('onsite_dispatches', data),

  getVanInventory: () => getOrInit('van_inventory', INITIAL_VAN_INVENTORY),
  saveVanInventory: (data: any) => save('van_inventory', data),

  getScrapItems: () => getOrInit('scrap_items', INITIAL_SCRAP_ITEMS),
  saveScrapItems: (data: any) => save('scrap_items', data),

  getFaultGuides: () => getOrInit('fault_guides', INITIAL_FAULT_GUIDES),
  saveFaultGuides: (data: any) => save('fault_guides', data),

  getCsatSurveys: () => getOrInit('csat_surveys', INITIAL_CSAT_SURVEYS),
  saveCsatSurveys: (data: any) => save('csat_surveys', data),

  getWarrantyActivations: () => getOrInit('warranty_activations', INITIAL_WARRANTY_ACTIVATIONS),
  saveWarrantyActivations: (data: any) => save('warranty_activations', data),

  // Reset all data to factory demo defaults
  resetAll: () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
  },
};
