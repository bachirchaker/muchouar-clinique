import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { consultationSchema } from "@/lib/validations/consultation";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        appointment: true,
        prescriptions: true
      }
    });

    if (!consultation) return NextResponse.json(errorResponse("Consultation non trouvée", 404), { status: 404 });

    return NextResponse.json(successResponse(consultation));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const validatedData = consultationSchema.parse(body);

    const consultation = await prisma.consultation.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
      }
    });

    return NextResponse.json(successResponse(consultation, "Consultation mise à jour"));
  } catch (error: any) {
    if (error.name === "ZodError") return NextResponse.json(errorResponse("Données invalides", 400, error.errors), { status: 400 });
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    await prisma.consultation.delete({ where: { id: params.id } });

    return NextResponse.json(successResponse(null, "Consultation supprimée"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
