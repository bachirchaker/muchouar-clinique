import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || "";
    const patientId = searchParams.get("patientId") || "";
    const doctorId = searchParams.get("doctorId") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (category) where.category = category;

    const labTests = await prisma.labTest.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, patientNumber: true } },
        doctor: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(successResponse(labTests, "Analyses récupérées"));
  } catch (error) {
    console.error("Erreur labo:", error);
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTest = await prisma.labTest.create({
      data: {
        ...body,
        status: "REQUESTED", // Default status
      },
    });

    return NextResponse.json(successResponse(newTest, "Analyse demandée avec succès"), { status: 201 });
  } catch (error) {
    console.error("Erreur création labo:", error);
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
