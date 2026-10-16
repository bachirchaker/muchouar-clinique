// ============================================
// MUCHOUAR CLINIQUE - Audit Logger
// ============================================

import prisma from './prisma';

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'VIEW' 
  | 'EXPORT' 
  | 'PRINT'
  | 'PAYMENT'
  | 'PRESCRIPTION'
  | 'STATUS_CHANGE';

export interface AuditLogEntry {
  userId?: string;
  action: AuditAction;
  module: string;
  entityId?: string;
  entityType?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        module: entry.module,
        entityId: entry.entityId,
        entityType: entry.entityType,
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Audit logging should never break the application
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Extract IP address and user agent from request headers
 */
export function getRequestMeta(headers: Headers): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress:
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      undefined,
    userAgent: headers.get('user-agent') || undefined,
  };
}
