import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ADMITTED";
    
    const admissions = await prisma.admission.findMany({
      where: status !== "all" ? { status: status as any } : {},
      include: { 
        patient: true, 
        bed: { include: { room: true } },
        doctor: { include: { employee: true } }
      },
      orderBy: { admissionDate: 'desc' }
    });
    return NextResponse.json(admissions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const admission = await prisma.admission.create({ data: body });
    // Also update bed status
    if (body.bedId) {
      await prisma.bed.update({
        where: { id: body.bedId },
        data: { status: 'OCCUPIED' }
      });
    }
    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
