import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'Toutes') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where })
    ]);

    return NextResponse.json(successResponse(invoices, { total, page, limit }));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message || 'Erreur lors de la récupération des factures'), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, items, discount = 0, taxRate = 0, insuranceCoverage = 0, notes } = body;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = discount;
    const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
    const totalAmount = subtotal - discountAmount + taxAmount;
    const patientAmount = totalAmount - insuranceCoverage;

    // Generate invoiceNumber: FAC-YYYYMMDD-XXXX
    const today = new Date();
    const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const todayCount = await prisma.invoice.count({
      where: {
        invoiceNumber: { startsWith: `FAC-${dateString}` }
      }
    });
    const invoiceNumber = `FAC-${dateString}-${(todayCount + 1).toString().padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        patientId,
        subtotal,
        discountAmount,
        taxAmount,
        insuranceCoverage,
        totalAmount,
        patientAmount,
        paidAmount: 0,
        status: 'Brouillon',
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        items: true,
        patient: true
      }
    });

    return NextResponse.json(successResponse(invoice), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message || 'Erreur lors de la création de la facture'), { status: 500 });
  }
}
