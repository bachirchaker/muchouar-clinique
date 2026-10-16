import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    const whereClause: any = {};
    if (status && status !== "all") whereClause.status = status;

    const tickets = await prisma.maintenanceTicket.findMany({
      where: whereClause,
      include: { reportedBy: true, assignedTo: true },
      orderBy: { reportedAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Generate simple ticket number
    const count = await prisma.maintenanceTicket.count();
    const ticketNumber = `TKT-${String(count + 1).padStart(4, '0')}`;
    
    const ticket = await prisma.maintenanceTicket.create({
      data: { ...body, ticketNumber, reportedAt: new Date() }
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
