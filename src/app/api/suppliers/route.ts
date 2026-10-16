import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supplier = await prisma.supplier.create({ data: body });
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur système" }, { status: 500 });
  }
}
