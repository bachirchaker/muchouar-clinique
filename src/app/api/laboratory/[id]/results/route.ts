import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { results } = body; // Array of results

    if (!Array.isArray(results)) {
      return NextResponse.json(errorResponse("Format invalide", 400), { status: 400 });
    }

    const test = await prisma.labTest.findUnique({ where: { id: params.id } });
    if (!test) return NextResponse.json(errorResponse("Analyse non trouvée", 404), { status: 404 });

    // Assuming a LabResult model exists related to LabTest
    const createdResults = await prisma.$transaction(
      results.map((r: any) =>
        prisma.labResult.create({
          data: {
            labTestId: params.id,
            parameterName: r.parameterName,
            value: r.value,
            unit: r.unit,
            referenceRange: r.referenceRange,
            isAbnormal: r.isAbnormal || false,
          },
        })
      )
    );

    // Update test status to COMPLETED
    await prisma.labTest.update({
      where: { id: params.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(successResponse(createdResults, "Résultats enregistrés avec succès"), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
