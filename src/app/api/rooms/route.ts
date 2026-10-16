import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const floor = searchParams.get("floor");
    const department = searchParams.get("department");
    
    const whereClause: any = {};
    if (status && status !== "all") whereClause.status = status;
    if (floor && floor !== "all") whereClause.floor = parseInt(floor);
    if (department && department !== "all") whereClause.department = department;

    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: { beds: true },
      orderBy: { roomNumber: 'asc' }
    });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const room = await prisma.room.create({ data: body });
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
