// ============================================
// MUCHOUAR CLINIQUE - RBAC Permission System
// ============================================

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'print';

export type PermissionModule =
  | 'dashboard'
  | 'patients'
  | 'doctors'
  | 'nurses'
  | 'appointments'
  | 'consultations'
  | 'prescriptions'
  | 'medical_records'
  | 'laboratory'
  | 'imaging'
  | 'hospitalization'
  | 'rooms'
  | 'pharmacy'
  | 'inventory'
  | 'suppliers'
  | 'purchases'
  | 'invoices'
  | 'payments'
  | 'cash_register'
  | 'insurance'
  | 'expenses'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'cleaning'
  | 'maintenance'
  | 'reports'
  | 'statistics'
  | 'users'
  | 'roles'
  | 'audit_log'
  | 'settings'
  | 'documents'
  | 'notifications';

export type Permission = `${PermissionModule}.${PermissionAction}`;

// Default role permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    // Admin has ALL permissions
    ...generateAllPermissions(),
  ],

  DOCTOR: [
    'dashboard.view',
    'patients.view', 'patients.create', 'patients.edit',
    'appointments.view', 'appointments.create', 'appointments.edit',
    'consultations.view', 'consultations.create', 'consultations.edit',
    'prescriptions.view', 'prescriptions.create', 'prescriptions.edit', 'prescriptions.print',
    'medical_records.view', 'medical_records.create', 'medical_records.edit',
    'laboratory.view', 'laboratory.create',
    'imaging.view', 'imaging.create',
    'hospitalization.view', 'hospitalization.create', 'hospitalization.edit',
    'rooms.view',
    'pharmacy.view',
    'documents.view', 'documents.create',
    'reports.view',
    'statistics.view',
    'notifications.view',
  ],

  NURSE: [
    'dashboard.view',
    'patients.view',
    'appointments.view',
    'consultations.view',
    'prescriptions.view',
    'medical_records.view',
    'hospitalization.view', 'hospitalization.edit',
    'rooms.view',
    'pharmacy.view',
    'documents.view',
    'notifications.view',
  ],

  RECEPTIONIST: [
    'dashboard.view',
    'patients.view', 'patients.create', 'patients.edit',
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
    'consultations.view',
    'invoices.view', 'invoices.create',
    'payments.view', 'payments.create',
    'cash_register.view', 'cash_register.create', 'cash_register.edit',
    'insurance.view',
    'documents.view', 'documents.print',
    'notifications.view',
  ],

  ACCOUNTANT: [
    'dashboard.view',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.export',
    'payments.view', 'payments.create', 'payments.edit', 'payments.export',
    'cash_register.view', 'cash_register.create', 'cash_register.edit',
    'insurance.view', 'insurance.edit',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.export',
    'reports.view', 'reports.export',
    'statistics.view',
    'employees.view',
    'attendance.view',
    'notifications.view',
  ],

  PHARMACIST: [
    'dashboard.view',
    'pharmacy.view', 'pharmacy.create', 'pharmacy.edit',
    'inventory.view', 'inventory.create', 'inventory.edit',
    'prescriptions.view',
    'suppliers.view',
    'purchases.view', 'purchases.create',
    'reports.view',
    'notifications.view',
  ],

  LAB_TECHNICIAN: [
    'dashboard.view',
    'laboratory.view', 'laboratory.create', 'laboratory.edit',
    'patients.view',
    'documents.view', 'documents.create',
    'notifications.view',
  ],

  CLEANER: [
    'cleaning.view', 'cleaning.edit',
    'notifications.view',
  ],

  MAINTENANCE: [
    'maintenance.view', 'maintenance.edit',
    'notifications.view',
  ],

  MANAGER: [
    'dashboard.view',
    'patients.view',
    'doctors.view',
    'nurses.view',
    'appointments.view',
    'consultations.view',
    'invoices.view', 'invoices.export',
    'payments.view', 'payments.export',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.export',
    'employees.view', 'employees.create', 'employees.edit',
    'attendance.view', 'attendance.export',
    'leaves.view', 'leaves.edit',
    'cleaning.view', 'cleaning.create',
    'maintenance.view', 'maintenance.create',
    'inventory.view',
    'reports.view', 'reports.export',
    'statistics.view',
    'users.view',
    'notifications.view',
    'settings.view',
  ],
};

function generateAllPermissions(): Permission[] {
  const modules: PermissionModule[] = [
    'dashboard', 'patients', 'doctors', 'nurses', 'appointments',
    'consultations', 'prescriptions', 'medical_records', 'laboratory',
    'imaging', 'hospitalization', 'rooms', 'pharmacy', 'inventory',
    'suppliers', 'purchases', 'invoices', 'payments', 'cash_register',
    'insurance', 'expenses', 'employees', 'attendance', 'leaves',
    'cleaning', 'maintenance', 'reports', 'statistics', 'users',
    'roles', 'audit_log', 'settings', 'documents', 'notifications',
  ];
  const actions: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'export', 'print'];

  return modules.flatMap((module) =>
    actions.map((action) => `${module}.${action}` as Permission)
  );
}

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(
  userRole: string,
  permission: Permission,
  customPermissions?: Permission[]
): boolean {
  // Custom permissions override role defaults
  if (customPermissions) {
    return customPermissions.includes(permission);
  }

  const rolePerms = ROLE_PERMISSIONS[userRole];
  if (!rolePerms) return false;

  return rolePerms.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  userRole: string,
  permissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(userRole, p, customPermissions));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  userRole: string,
  permissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(userRole, p, customPermissions));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get all available modules
 */
export function getAllModules(): PermissionModule[] {
  return [
    'dashboard', 'patients', 'doctors', 'nurses', 'appointments',
    'consultations', 'prescriptions', 'medical_records', 'laboratory',
    'imaging', 'hospitalization', 'rooms', 'pharmacy', 'inventory',
    'suppliers', 'purchases', 'invoices', 'payments', 'cash_register',
    'insurance', 'expenses', 'employees', 'attendance', 'leaves',
    'cleaning', 'maintenance', 'reports', 'statistics', 'users',
    'roles', 'audit_log', 'settings', 'documents', 'notifications',
  ];
}

/**
 * Get human-readable module name (French)
 */
export function getModuleName(module: PermissionModule): string {
  const names: Record<PermissionModule, string> = {
    dashboard: 'Tableau de bord',
    patients: 'Patients',
    doctors: 'Médecins',
    nurses: 'Infirmiers',
    appointments: 'Rendez-vous',
    consultations: 'Consultations',
    prescriptions: 'Prescriptions',
    medical_records: 'Dossiers médicaux',
    laboratory: 'Laboratoire',
    imaging: 'Imagerie',
    hospitalization: 'Hospitalisation',
    rooms: 'Chambres & Lits',
    pharmacy: 'Pharmacie',
    inventory: 'Stock',
    suppliers: 'Fournisseurs',
    purchases: 'Achats',
    invoices: 'Facturation',
    payments: 'Paiements',
    cash_register: 'Caisse',
    insurance: 'Assurances',
    expenses: 'Dépenses',
    employees: 'Personnel',
    attendance: 'Présence',
    leaves: 'Congés',
    cleaning: 'Nettoyage',
    maintenance: 'Maintenance',
    reports: 'Rapports',
    statistics: 'Statistiques',
    users: 'Utilisateurs',
    roles: 'Rôles & Permissions',
    audit_log: 'Journal d\'audit',
    settings: 'Paramètres',
    documents: 'Documents',
    notifications: 'Notifications',
  };
  return names[module] || module;
}

/**
 * Get human-readable action name (French)
 */
export function getActionName(action: PermissionAction): string {
  const names: Record<PermissionAction, string> = {
    view: 'Consulter',
    create: 'Créer',
    edit: 'Modifier',
    delete: 'Supprimer',
    export: 'Exporter',
    print: 'Imprimer',
  };
  return names[action] || action;
}
