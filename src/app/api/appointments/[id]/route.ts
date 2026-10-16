import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validations/appointment";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: { include: { user: true } }
      }
    });

    if (!appointment) return NextResponse.json(errorResponse("Rendez-vous non trouvé", 404), { status: 404 });

    return NextResponse.json(successResponse(appointment));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_APPOINTMENT",
        entity: "APPOINTMENT",
        entityId: appointment.id,
        userId: session.user.id,
        details: `Mise à jour du rendez-vous`
      }
    });

    return NextResponse.json(successResponse(appointment, "Rendez-vous mis à jour"));
  } catch (error: any) {
    if (error.name === "ZodError") return NextResponse.json(errorResponse("Données invalides", 400, error.errors), { status: 400 });
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    await prisma.appointment.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_APPOINTMENT",
        entity: "APPOINTMENT",
        entityId: params.id,
        userId: session.user.id,
        details: `Suppression du rendez-vous`
      }
    });

    return NextResponse.json(successResponse(null, "Rendez-vous supprimé"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
