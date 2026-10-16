import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const isReadParam = searchParams.get("isRead");
    
    const where: any = {};
    if (isReadParam !== null) {
      where.isRead = isReadParam === 'true';
    }

    // Usually filter by userId, assuming 'system' or dummy for now
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(successResponse(notifications, "Notifications récupérées"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json(successResponse(null, "Toutes les notifications marquées comme lues"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
