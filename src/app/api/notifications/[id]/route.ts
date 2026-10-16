import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json(successResponse(updated, "Notification marquée comme lue"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
