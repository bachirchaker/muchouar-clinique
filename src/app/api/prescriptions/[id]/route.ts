import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true, firstName: true, lastName: true, patientNumber: true,
            dateOfBirth: true, phone: true, gender: true,
          },
        },
        doctor: {
          select: {
            specialty: true,
            employee: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        consultation: {
          select: { id: true, diagnosis: true, date: true },
        },
        items: {
          include: { medication: true },
        },
      },
    });

    if (!prescription) {
      return notFoundResponse('Prescription');
    }

    return successResponse(prescription);
  } catch (error) {
    console.error('Prescription GET error:', error);
    return errorResponse('Erreur', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.prescription.findUnique({ where: { id } });
    if (!existing) return notFoundResponse('Prescription');

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
      },
    });

    return successResponse(prescription, 'Prescription mise à jour');
  } catch (error) {
    console.error('Prescription PUT error:', error);
    return errorResponse('Erreur', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.prescription.findUnique({ where: { id } });
    if (!existing) return notFoundResponse('Prescription');

    await prisma.prescription.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return successResponse(null, 'Prescription annulée');
  } catch (error) {
    console.error('Prescription DELETE error:', error);
    return errorResponse('Erreur', 500);
  }
}
