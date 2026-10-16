import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get('method');
    
    const where: any = {};
    if (method && method !== 'Tous') {
      where.method = method;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: { 
        invoice: {
          include: { patient: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(successResponse(payments));
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur lors de la récupération des paiements'), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, amount, method, reference, notes, receivedBy } = body;

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      return NextResponse.json(errorResponse('Facture introuvable'), { status: 404 });
    }

    // Execute within a transaction
    const [payment, updatedInvoice] = await prisma.$transaction(async (prisma) => {
      const newPayment = await prisma.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          reference,
          notes,
          receivedBy,
        }
      });

      const newPaidAmount = invoice.paidAmount + amount;
      
      let newStatus = invoice.status;
      if (newPaidAmount >= invoice.patientAmount) {
        newStatus = 'Payée';
      } else if (newPaidAmount > 0) {
        newStatus = 'Partiellement';
      }

      const inv = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus
        }
      });

      return [newPayment, inv];
    });

    return NextResponse.json(successResponse({ payment, invoice: updatedInvoice }), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message || 'Erreur lors de la création du paiement'), { status: 500 });
  }
}
