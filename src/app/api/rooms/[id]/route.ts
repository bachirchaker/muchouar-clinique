import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.room.findUnique({ 
      where: { id: params.id },
      include: { beds: { include: { admissions: { where: { status: "ADMITTED" } } } } }
    });
    if (!room) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const room = await prisma.room.update({
      where: { id: params.id },
      data: body
    });
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.room.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
