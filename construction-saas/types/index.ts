// TypeScript type definitions for Construction SaaS

export interface User {
  id: string
  accountId: string
  email: string
  firstName: string
  lastName: string
  role: 'owner' | 'pm' | 'super' | 'bookkeeper'
  phoneNumber?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  companyName: string
  planType: 'trial' | 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  qbRealmId?: string
  qbAccessToken?: string
  qbRefreshToken?: string
  qbTokenExpiry?: Date
  emailProvider?: 'gmail' | 'microsoft'
  emailAccessToken?: string
  emailRefreshToken?: string
  emailTokenExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  accountId: string
  name: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  status: 'active' | 'on_hold' | 'completed' | 'cancelled'
  startDate?: Date
  endDate?: Date
  estimatedBudget?: number
  actualCost: number
  qbJobId?: string
  qbClassName?: string
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  accountId: string
  type: 'owner' | 'architect' | 'sub' | 'vendor' | 'other'
  companyName?: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  role?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface RFI {
  id: string
  accountId: string
  projectId: string
  rfiNumber: string
  subject: string
  question: string
  response?: string
  status: 'draft' | 'sent' | 'responded' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  fromContactId?: string
  toContactId?: string
  dueDate?: Date
  sentDate?: Date
  responseDate?: Date
  createdById: string
  aiGenerated: boolean
  aiConfidence?: number
  sourceEmailId?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChangeOrder {
  id: string
  accountId: string
  projectId: string
  coNumber: string
  title: string
  description: string
  reason?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
  priceImpact: number
  scheduleImpact: number
  contactId?: string
  submittedDate?: Date
  approvedDate?: Date
  rejectedDate?: Date
  rejectionReason?: string
  createdById: string
  aiGenerated: boolean
  aiConfidence?: number
  sourceEmailId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  accountId: string
  projectId: string
  vendorId?: string
  invoiceNumber?: string
  invoiceDate?: Date
  dueDate?: Date
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'approved' | 'paid' | 'disputed'
  category?: string
  costCode?: string
  qbTxnId?: string
  qbSyncedAt?: Date
  isMultiJob: boolean
  allocations?: any
  notes?: string
  aiExtracted: boolean
  aiConfidence?: number
  rawExtraction?: any
  createdAt: Date
  updatedAt: Date
  lineItems?: InvoiceLineItem[]
}

export interface InvoiceLineItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  category?: string
}

export interface DailyReport {
  id: string
  accountId: string
  projectId: string
  reportDate: Date
  weatherAM?: string
  weatherPM?: string
  temperature?: string
  workPerformed?: string
  laborSummary?: any
  equipmentUsed?: string
  deliveries?: string
  delays?: string
  safetyIssues?: string
  photos?: any
  createdById: string
  voiceRecorded: boolean
  transcriptId?: string
  createdAt: Date
  updatedAt: Date
}

export interface File {
  id: string
  accountId: string
  projectId?: string
  fileName: string
  fileType: string
  mimeType: string
  fileSize: number
  storagePath: string
  storageUrl?: string
  linkedEntityType?: string
  linkedEntityId?: string
  uploadedAt: Date
}

export interface AIEvent {
  id: string
  accountId: string
  eventType: 'email_rfi' | 'email_co' | 'invoice_upload' | 'voice_daily'
  status: 'processing' | 'completed' | 'failed' | 'needs_review'
  rawInput: any
  aiProvider?: string
  aiModel?: string
  aiPrompt?: string
  aiResponse?: any
  aiConfidence?: number
  createdEntityType?: string
  createdEntityId?: string
  processingTime?: number
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginResponse {
  token: string
  user: User
  account: Account
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  phoneNumber?: string
}

// Form types
export interface ProjectFormData {
  name: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  startDate?: string
  endDate?: string
  estimatedBudget?: string
}

export interface RFIFormData {
  projectId: string
  subject: string
  question: string
  priority: RFI['priority']
  toContactId?: string
  dueDate?: string
}

export interface ChangeOrderFormData {
  projectId: string
  title: string
  description: string
  reason?: string
  priceImpact: string
  scheduleImpact: string
  contactId?: string
}

export interface DailyReportFormData {
  projectId: string
  reportDate: string
  weatherAM?: string
  weatherPM?: string
  temperature?: string
  workPerformed?: string
  equipmentUsed?: string
  deliveries?: string
  delays?: string
  safetyIssues?: string
}
