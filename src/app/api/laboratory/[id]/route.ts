import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const test = await prisma.labTest.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        results: true,
      },
    });

    if (!test) return NextResponse.json(errorResponse("Analyse non trouvée", 404), { status: 404 });

    return NextResponse.json(successResponse(test, "Analyse récupérée"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, remarks } = body;

    const updatedTest = await prisma.labTest.update({
      where: { id: params.id },
      data: { 
        ...(status && { status }),
        ...(remarks && { remarks }),
      },
    });

    return NextResponse.json(successResponse(updatedTest, "Statut mis à jour"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
