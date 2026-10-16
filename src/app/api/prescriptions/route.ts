import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  successResponse, errorResponse, paginatedResponse, parsePaginationParams,
} from '@/lib/api-response';
import { prescriptionSchema } from '@/lib/validations';
import { createAuditLog, getRequestMeta } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = parsePaginationParams(searchParams);
    const patientId = searchParams.get('patientId') || '';
    const doctorId = searchParams.get('doctorId') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { patient: { firstName: { contains: search } } },
        { patient: { lastName: { contains: search } } },
      ];
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          patient: { select: { firstName: true, lastName: true, patientNumber: true } },
          doctor: {
            select: {
              specialty: true,
              employee: { select: { firstName: true, lastName: true } },
            },
          },
          items: {
            include: {
              medication: { select: { name: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.prescription.count({ where }),
    ]);

    return paginatedResponse(prescriptions, total, page, pageSize);
  } catch (error) {
    console.error('Prescriptions GET error:', error);
    return errorResponse('Erreur lors du chargement des prescriptions', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = prescriptionSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.errors.map((e) => e.message).join(', '),
        422
      );
    }

    const { items, ...data } = validation.data;

    const prescription = await prisma.prescription.create({
      data: {
        ...data,
        date: new Date(),
        items: {
          create: items.map((item) => ({
            medicationName: item.medicationName,
            medicationId: item.medicationId || undefined,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            route: item.route,
            instructions: item.instructions,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
        patient: { select: { firstName: true, lastName: true } },
        doctor: {
          select: {
            employee: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    const meta = getRequestMeta(request.headers);
    await createAuditLog({
      action: 'PRESCRIPTION',
      module: 'prescriptions',
      entityId: prescription.id,
      entityType: 'Prescription',
      details: {
        patientId: data.patientId,
        itemCount: items.length,
      },
      ...meta,
    });

    return successResponse(prescription, 'Prescription créée avec succès', 201);
  } catch (error) {
    console.error('Prescriptions POST error:', error);
    return errorResponse('Erreur lors de la création de la prescription', 500);
  }
}
