import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = await prisma.maintenanceTicket.findUnique({ where: { id: params.id } });
    if (!ticket) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const ticket = await prisma.maintenanceTicket.update({
      where: { id: params.id },
      data: body
    });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.maintenanceTicket.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
