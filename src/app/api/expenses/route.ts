import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const where: any = {};
    if (category && category !== 'Toutes') {
      where.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    const total = await prisma.expense.count({ where });

    return NextResponse.json(successResponse(expenses, { total, page, limit }));
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur lors de la récupération des dépenses'), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const expense = await prisma.expense.create({
      data: body
    });

    return NextResponse.json(successResponse(expense), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse('Erreur lors de la création de la dépense'), { status: 500 });
  }
}
