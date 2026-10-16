import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const expired = searchParams.get("expired");

    const whereClause: any = { isActive: true };
    if (category) whereClause.category = category;
    if (search) whereClause.name = { contains: search };
    if (expired === 'true') whereClause.expiryDate = { lt: new Date() };

    let items = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: { supplier: true, medication: true },
      orderBy: { name: 'asc' }
    });

    if (searchParams.get("lowStock") === 'true') {
      items = items.filter(item => item.quantity <= item.minQuantity);
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération de l'inventaire" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.inventoryItem.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'article" }, { status: 500 });
  }
}
