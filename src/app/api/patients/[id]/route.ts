import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        appointments: { orderBy: { date: "desc" } },
        consultations: { orderBy: { date: "desc" } },
        prescriptions: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { date: "desc" } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!patient) {
      return NextResponse.json(errorResponse("Patient non trouvé", 404), { status: 404 });
    }

    return NextResponse.json(successResponse(patient, "Patient récupéré avec succès"));
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = patientSchema.partial().parse(body);

    const existingPatient = await prisma.patient.findUnique({
      where: { id: params.id },
    });

    if (!existingPatient) {
      return NextResponse.json(errorResponse("Patient non trouvé", 404), { status: 404 });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: params.id },
      data: validatedData,
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Patient",
        entityId: updatedPatient.id,
        details: `Patient mis à jour: ${updatedPatient.patientNumber}`,
        userId: "system",
      },
    });

    return NextResponse.json(successResponse(updatedPatient, "Patient mis à jour avec succès"));
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du patient:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(errorResponse("Données invalides", 400, error.errors), { status: 400 });
    }
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPatient = await prisma.patient.findUnique({
      where: { id: params.id },
    });

    if (!existingPatient) {
      return NextResponse.json(errorResponse("Patient non trouvé", 404), { status: 404 });
    }

    await prisma.patient.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Patient",
        entityId: params.id,
        details: `Patient supprimé (soft delete): ${existingPatient.patientNumber}`,
        userId: "system",
      },
    });

    return NextResponse.json(successResponse(null, "Patient supprimé avec succès"));
  } catch (error) {
    console.error("Erreur lors de la suppression du patient:", error);
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
