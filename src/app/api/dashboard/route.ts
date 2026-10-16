import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Parallel queries for performance
    const [
      patientsToday,
      newPatientsMonth,
      activePatients,
      hospitalizedPatients,
      appointmentsToday,
      upcomingAppointments,
      completedAppointmentsToday,
      cancelledAppointmentsToday,
      noShowAppointments,
      consultationsToday,
      consultationsWeek,
      consultationsMonth,
      totalRevenue,
      totalPayments,
      unpaidInvoices,
      totalExpenses,
      presentStaff,
      absentStaff,
      availableDoctors,
      availableNurses,
      totalInventory,
      lowStockItems,
      expiredItems,
      outOfStockItems,
      occupiedRooms,
      availableRooms,
      totalBeds,
      availableBeds,
      recentAppointments,
      recentAuditLogs,
    ] = await Promise.all([
      // Patients
      prisma.appointment.count({
        where: { dateTime: { gte: today, lt: tomorrow } },
      }),
      prisma.patient.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.patient.count({ where: { isActive: true } }),
      prisma.admission.count({ where: { status: 'ADMITTED' } }),

      // Appointments
      prisma.appointment.count({
        where: { dateTime: { gte: today, lt: tomorrow } },
      }),
      prisma.appointment.count({
        where: { dateTime: { gt: new Date() }, status: { in: ['PENDING', 'CONFIRMED'] } },
      }),
      prisma.appointment.count({
        where: { dateTime: { gte: today, lt: tomorrow }, status: 'COMPLETED' },
      }),
      prisma.appointment.count({
        where: { dateTime: { gte: today, lt: tomorrow }, status: 'CANCELLED' },
      }),
      prisma.appointment.count({
        where: { dateTime: { gte: today, lt: tomorrow }, status: 'NO_SHOW' },
      }),

      // Consultations
      prisma.consultation.count({
        where: { date: { gte: today, lt: tomorrow } },
      }),
      prisma.consultation.count({
        where: { date: { gte: startOfWeek } },
      }),
      prisma.consultation.count({
        where: { date: { gte: startOfMonth } },
      }),

      // Finance
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PAID', 'PARTIALLY_PAID'] }, date: { gte: startOfMonth } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth } },
      }),
      prisma.invoice.count({
        where: { status: { in: ['UNPAID', 'SENT'] } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth } },
      }),

      // Staff
      prisma.attendance.count({
        where: { date: { gte: today, lt: tomorrow }, status: 'present' },
      }),
      prisma.attendance.count({
        where: { date: { gte: today, lt: tomorrow }, status: 'absent' },
      }),
      prisma.doctor.count({ where: { isAvailable: true } }),
      prisma.nurse.count(),

      // Inventory
      prisma.inventoryItem.count({ where: { isActive: true } }),
      prisma.inventoryItem.count({
        where: { isActive: true, quantity: { lte: prisma.inventoryItem.fields.minQuantity } },
      }).catch(() => 
        // Fallback: can't use field reference in simple count, use raw
        prisma.$queryRaw`SELECT COUNT(*) as count FROM inventory_items WHERE is_active = 1 AND quantity <= min_quantity`.then((r: any) => Number(r[0]?.count ?? 0))
      ),
      prisma.inventoryItem.count({
        where: { isActive: true, expiryDate: { lt: new Date() } },
      }),
      prisma.inventoryItem.count({
        where: { isActive: true, quantity: 0 },
      }),

      // Rooms & Beds
      prisma.room.count({ where: { status: 'OCCUPIED' } }),
      prisma.room.count({ where: { status: 'AVAILABLE' } }),
      prisma.bed.count(),
      prisma.bed.count({ where: { status: 'AVAILABLE' } }),

      // Recent Appointments for list
      prisma.appointment.findMany({
        where: { dateTime: { gte: new Date() } },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          doctor: {
            select: {
              specialty: true,
              employee: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { dateTime: 'asc' },
        take: 8,
      }),

      // Recent audit logs for activity feed
      prisma.auditLog.findMany({
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ]);

    const revenue = Number(totalRevenue._sum.totalAmount ?? 0);
    const payments = Number(totalPayments._sum.amount ?? 0);
    const expenses = Number(totalExpenses._sum.amount ?? 0);

    const stats = {
      patients: {
        today: patientsToday,
        newThisMonth: newPatientsMonth,
        active: activePatients,
        hospitalized: hospitalizedPatients,
        trend: newPatientsMonth > 0 ? Math.round((newPatientsMonth / Math.max(activePatients, 1)) * 100) : 0,
      },
      appointments: {
        today: appointmentsToday,
        upcoming: upcomingAppointments,
        completed: completedAppointmentsToday,
        cancelled: cancelledAppointmentsToday,
        noShow: noShowAppointments,
      },
      consultations: {
        today: consultationsToday,
        thisWeek: consultationsWeek,
        thisMonth: consultationsMonth,
      },
      finance: {
        revenue,
        payments,
        unpaidInvoices,
        expenses,
        profit: revenue - expenses,
      },
      staff: {
        presentToday: presentStaff,
        absent: absentStaff,
        doctorsAvailable: availableDoctors,
        nursesAvailable: availableNurses,
      },
      inventory: {
        totalProducts: totalInventory,
        lowStock: typeof lowStockItems === 'number' ? lowStockItems : 0,
        expired: expiredItems,
        outOfStock: outOfStockItems,
      },
      rooms: {
        occupied: occupiedRooms,
        available: availableRooms,
        totalBeds,
        availableBeds,
      },
    };

    const upcomingAppointmentsList = recentAppointments.map((apt) => ({
      id: apt.id,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
      doctorName: `${apt.doctor.employee.firstName} ${apt.doctor.employee.lastName}`,
      specialty: apt.doctor.specialty,
      time: new Date(apt.dateTime).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: apt.status,
    }));

    const recentActivityList = recentAuditLogs.map((log) => ({
      id: log.id,
      type: mapModuleToActivityType(log.module),
      description: formatAuditDescription(log.action, log.module, log.entityType),
      time: formatRelativeTime(log.timestamp),
      user: log.user
        ? `${log.user.firstName} ${log.user.lastName}`
        : 'Système',
    }));

    return successResponse({
      stats,
      upcomingAppointments: upcomingAppointmentsList,
      recentActivity: recentActivityList,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return errorResponse('Erreur lors du chargement du tableau de bord', 500);
  }
}

function mapModuleToActivityType(module: string): string {
  const map: Record<string, string> = {
    appointments: 'appointment',
    consultations: 'consultation',
    payments: 'payment',
    patients: 'patient',
    laboratory: 'lab',
  };
  return map[module] || 'patient';
}

function formatAuditDescription(action: string, module: string, entityType?: string | null): string {
  const moduleNames: Record<string, string> = {
    patients: 'patient',
    appointments: 'rendez-vous',
    consultations: 'consultation',
    prescriptions: 'prescription',
    invoices: 'facture',
    payments: 'paiement',
    laboratory: 'analyse',
    inventory: 'stock',
    employees: 'employé',
  };

  const actionNames: Record<string, string> = {
    CREATE: 'Création',
    UPDATE: 'Modification',
    DELETE: 'Suppression',
    LOGIN: 'Connexion',
    LOGOUT: 'Déconnexion',
    VIEW: 'Consultation',
    EXPORT: 'Export',
    PAYMENT: 'Paiement',
  };

  const moduleName = moduleNames[module] || module;
  const actionName = actionNames[action] || action;

  return `${actionName} d'un(e) ${moduleName}`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return new Date(date).toLocaleDateString('fr-FR');
}
