import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    });
    if (!supplier) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Erreur système" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: body
    });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Erreur système" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.supplier.update({
      where: { id: params.id },
      data: { isActive: false }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur système" }, { status: 500 });
  }
}
