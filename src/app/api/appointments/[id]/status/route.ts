import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "ARRIVED", "IN_CONSULTATION", "COMPLETED", "CANCELLED", "NO_SHOW"])
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const { status } = statusSchema.parse(body);

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_APPOINTMENT_STATUS",
        entity: "APPOINTMENT",
        entityId: appointment.id,
        userId: session.user.id,
        details: `Changement de statut en ${status}`
      }
    });

    return NextResponse.json(successResponse(appointment, `Statut mis à jour en ${status}`));
  } catch (error: any) {
    if (error.name === "ZodError") return NextResponse.json(errorResponse("Statut invalide", 400), { status: 400 });
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
