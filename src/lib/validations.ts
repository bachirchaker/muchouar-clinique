// ============================================
// MUCHOUAR CLINIQUE - Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

// ============ COMMON ============

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============ AUTH ============

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============ PATIENTS ============

export const patientSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  dateOfBirth: z.string().min(1, 'La date de naissance est requise'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Le sexe est requis' }),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  profession: z.string().optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  bloodGroup: z
    .enum([
      'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
      'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE',
    ])
    .optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  medicalHistory: z.string().optional(),
  previousSurgeries: z.string().optional(),
  currentMedications: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  insuranceId: z.string().optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;

// ============ APPOINTMENTS ============

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  doctorId: z.string().min(1, 'Le médecin est requis'),
  dateTime: z.string().min(1, 'La date et l\'heure sont requises'),
  endTime: z.string().optional(),
  type: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  roomNumber: z.string().optional(),
  status: z
    .enum([
      'PENDING', 'CONFIRMED', 'ARRIVED', 'IN_CONSULTATION',
      'COMPLETED', 'CANCELLED', 'NO_SHOW',
    ])
    .default('PENDING'),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

// ============ CONSULTATIONS ============

export const consultationSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  doctorId: z.string().min(1, 'Le médecin est requis'),
  appointmentId: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  chiefComplaint: z.string().min(1, 'Le motif de consultation est requis'),
  symptoms: z.string().optional(),
  temperature: z.coerce.number().optional(),
  bloodPressureSystolic: z.coerce.number().optional(),
  bloodPressureDiastolic: z.coerce.number().optional(),
  heartRate: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  oxygenSaturation: z.coerce.number().optional(),
  respiratoryRate: z.coerce.number().optional(),
  physicalExamination: z.string().optional(),
  diagnosis: z.string().min(1, 'Le diagnostic est requis'),
  treatment: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('IN_PROGRESS'),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

// ============ PRESCRIPTIONS ============

export const prescriptionItemSchema = z.object({
  medicationId: z.string().optional(),
  medicationName: z.string().min(1, 'Le nom du médicament est requis'),
  dosage: z.string().min(1, 'Le dosage est requis'),
  frequency: z.string().min(1, 'La fréquence est requise'),
  duration: z.string().min(1, 'La durée est requise'),
  route: z.string().min(1, 'La voie d\'administration est requise'),
  instructions: z.string().optional(),
  quantity: z.coerce.number().optional(),
});

export const prescriptionSchema = z.object({
  consultationId: z.string().min(1, 'La consultation est requise'),
  patientId: z.string().min(1, 'Le patient est requis'),
  doctorId: z.string().min(1, 'Le médecin est requis'),
  notes: z.string().optional(),
  items: z.array(prescriptionItemSchema).min(1, 'Au moins un médicament est requis'),
});

export type PrescriptionInput = z.infer<typeof prescriptionSchema>;

// ============ INVOICES ============

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  quantity: z.coerce.number().min(1, 'La quantité doit être au moins 1').default(1),
  unitPrice: z.coerce.number().min(0, 'Le prix unitaire est requis'),
  consultationId: z.string().optional(),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  dueDate: z.string().optional(),
  discount: z.coerce.number().min(0).default(0),
  taxAmount: z.coerce.number().min(0).default(0),
  insuranceCoverage: z.coerce.number().min(0).default(0),
  insuranceId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'Au moins un élément est requis'),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// ============ PAYMENTS ============

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'La facture est requise'),
  amount: z.coerce.number().min(0.01, 'Le montant doit être positif'),
  method: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'CHECK', 'INSURANCE', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  cashRegisterId: z.string().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

// ============ EMPLOYEES ============

export const employeeSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  position: z.string().min(1, 'Le poste est requis'),
  department: z.string().min(1, 'Le service est requis'),
  contractType: z.string().optional(),
  hireDate: z.string().min(1, 'La date d\'embauche est requise'),
  endDate: z.string().optional(),
  baseSalary: z.coerce.number().min(0, 'Le salaire doit être positif'),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

// ============ ROOMS ============

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Le numéro de chambre est requis'),
  floor: z.coerce.number().min(0),
  building: z.string().optional(),
  department: z.string().min(1, 'Le service est requis'),
  type: z.string().min(1, 'Le type est requis'),
  capacity: z.coerce.number().min(1).default(1),
  pricePerDay: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
});

export type RoomInput = z.infer<typeof roomSchema>;

// ============ INVENTORY ============

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  sku: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  medicationId: z.string().optional(),
  quantity: z.coerce.number().min(0).default(0),
  minQuantity: z.coerce.number().min(0).default(10),
  unit: z.string().min(1, 'L\'unité est requise'),
  purchasePrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  location: z.string().optional(),
  supplierId: z.string().optional(),
});

export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;

// ============ EXPENSES ============

export const expenseSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  category: z.enum([
    'SALARY', 'RENT', 'ELECTRICITY', 'WATER', 'INTERNET',
    'SUPPLIES', 'MEDICATION', 'MAINTENANCE', 'CLEANING',
    'MARKETING', 'TRANSPORT', 'OTHER',
  ]),
  amount: z.coerce.number().min(0.01, 'Le montant doit être positif'),
  date: z.string().min(1, 'La date est requise'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// ============ LEAVE REQUESTS ============

export const leaveRequestSchema = z.object({
  type: z.enum(['ANNUAL', 'SICK', 'EXCEPTIONAL', 'MATERNITY', 'PATERNITY', 'OTHER']),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  reason: z.string().optional(),
});

export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;

// ============ CLEANING TASKS ============

export const cleaningTaskSchema = z.object({
  zone: z.string().min(1, 'La zone est requise'),
  location: z.string().min(1, 'L\'emplacement est requis'),
  roomId: z.string().optional(),
  assignedToId: z.string().optional(),
  taskType: z.string().min(1, 'Le type de tâche est requis'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  scheduledDate: z.string().min(1, 'La date est requise'),
  comments: z.string().optional(),
});

export type CleaningTaskInput = z.infer<typeof cleaningTaskSchema>;

// ============ MAINTENANCE TICKETS ============

export const maintenanceTicketSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  location: z.string().min(1, 'La localisation est requise'),
  assignedToId: z.string().optional(),
});

export type MaintenanceTicketInput = z.infer<typeof maintenanceTicketSchema>;

// ============ LAB TESTS ============

export const labTestSchema = z.object({
  patientId: z.string().min(1, 'Le patient est requis'),
  doctorId: z.string().min(1, 'Le médecin est requis'),
  consultationId: z.string().optional(),
  testName: z.string().min(1, 'Le nom de l\'examen est requis'),
  testCode: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  urgency: z.string().default('normal'),
  notes: z.string().optional(),
});

export type LabTestInput = z.infer<typeof labTestSchema>;

// ============ USERS ============

export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  phone: z.string().optional(),
  role: z.enum([
    'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'ACCOUNTANT',
    'PHARMACIST', 'LAB_TECHNICIAN', 'CLEANER', 'MAINTENANCE', 'MANAGER',
  ]),
});

export type UserInput = z.infer<typeof userSchema>;

// ============ SUPPLIER ============

export const supplierSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
});

export type SupplierInput = z.infer<typeof supplierSchema>;

// ============ INSURANCE ============

export const insuranceSchema = z.object({
  companyName: z.string().min(1, 'Le nom de la compagnie est requis'),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  contractNumber: z.string().optional(),
  coveragePercentage: z.coerce.number().min(0).max(100).default(0),
  maxCoverage: z.coerce.number().min(0).optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export type InsuranceInput = z.infer<typeof insuranceSchema>;
