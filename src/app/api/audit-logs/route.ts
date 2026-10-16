import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { paginatedResponse, errorResponse, parsePaginationParams } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = parsePaginationParams(searchParams);
    const module = searchParams.get('module') || '';
    const action = searchParams.get('action') || '';
    const userId = searchParams.get('userId') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: Record<string, unknown> = {};

    if (module) where.module = module;
    if (action) where.action = action;
    if (userId) where.userId = userId;

    if (dateFrom || dateTo) {
      where.timestamp = {};
      if (dateFrom) (where.timestamp as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.timestamp as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, role: true },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return paginatedResponse(logs, total, page, pageSize);
  } catch (error) {
    console.error('Audit logs GET error:', error);
    return errorResponse('Erreur lors du chargement du journal', 500);
  }
}
