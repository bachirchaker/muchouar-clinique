import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        items: true,
        payments: true
      }
    });

    if (!invoice) {
      return NextResponse.json(errorResponse('Facture introuvable'), { status: 404 });
    }

    return NextResponse.json(successResponse(invoice));
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur serveur'), { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: body,
      include: { patient: true, items: true }
    });

    return NextResponse.json(successResponse(updatedInvoice));
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur lors de la mise à jour'), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete/cancel instead of hard delete
    const cancelledInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: { status: 'Annulée' }
    });

    return NextResponse.json(successResponse(cancelledInvoice));
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur lors de l\'annulation de la facture'), { status: 500 });
  }
}
